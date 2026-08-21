'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EventRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/events');
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-400 font-mono text-xs">
      Redirecting to Events...
    </div>
  );
}
