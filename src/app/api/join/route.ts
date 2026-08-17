import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      full_name,
      student_id,
      email,
      phone,
      department,
      trimester,
      cgpa,
      subteam_preference,
      experience,
      portfolio_url,
      reason_to_join,
    } = body;

    if (!full_name || !student_id || !email || !department || !subteam_preference) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Insert into Neon Database
    const result = await sql`
      INSERT INTO join_applications (
        full_name,
        student_id,
        email,
        phone,
        department,
        trimester,
        cgpa,
        subteam_preference,
        experience,
        portfolio_url,
        reason_to_join
      )
      VALUES (
        ${full_name},
        ${student_id},
        ${email},
        ${phone || ''},
        ${department},
        ${trimester || ''},
        ${cgpa || ''},
        ${subteam_preference},
        ${experience || ''},
        ${portfolio_url || ''},
        ${reason_to_join || ''}
      )
      RETURNING id, full_name, created_at;
    `;

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully to UIU Mars Rover Team database!',
      application: result[0],
    });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Database submission failed. Please try again later.' },
      { status: 500 }
    );
  }
}
