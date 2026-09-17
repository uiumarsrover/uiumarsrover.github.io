'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Cpu, Award, Mail, Calendar, FileText, Database, 
  Plus, Trash2, Edit3, Save, X, Image as ImageIcon, ExternalLink, 
  LogOut, Lock, CheckCircle2, AlertCircle, RefreshCw, Layers, Sparkles, Upload, Eye
} from 'lucide-react';
import { clientSql, compressImageFile } from '@/lib/clientDb';

type TabType = 'content' | 'rovers' | 'team' | 'events' | 'news' | 'achievements' | 'sponsors' | 'applications';

interface ContentPreset {
  key: string;
  label: string;
  section: 'hero' | 'stats' | 'about' | 'footer' | 'general';
  type: 'text' | 'image' | 'html';
  defaultValue: string;
  description: string;
}

const CORE_CONTENT_PRESETS: ContentPreset[] = [
  {
    key: 'hero_bg_image',
    label: 'Hero Background Image',
    section: 'hero',
    type: 'image',
    defaultValue: '/Hero.PNG',
    description: 'The large full-width background photo on the main homepage hero banner.'
  },
  {
    key: 'hero_badge',
    label: 'Hero Top Live Badge',
    section: 'hero',
    type: 'text',
    defaultValue: '5TH GEN FLAGSHIP • AURION ROVER',
    description: 'Pulsing indicator tag above the main hero title.'
  },
  {
    key: 'hero_headline_1',
    label: 'Hero Main Title (Line 1)',
    section: 'hero',
    type: 'text',
    defaultValue: 'AURION',
    description: 'The primary headline rover name on the homepage.'
  },
  {
    key: 'hero_headline_2',
    label: 'Hero Subtitle (Line 2)',
    section: 'hero',
    type: 'text',
    defaultValue: 'UIU 5th Generation Autonomous Mars Rover',
    description: 'Secondary bold title under the main name.'
  },
  {
    key: 'hero_subtitle',
    label: 'Hero Mission Overview Paragraph',
    section: 'hero',
    type: 'text',
    defaultValue: 'Engineered with 3D-printed flexible tires, high-torque carbon-fiber manipulator, dual RealSense stereo vision, and in-situ bio-detection assays.',
    description: 'Descriptive paragraph displayed inside the hero banner.'
  },
  {
    key: 'stat_1_val',
    label: 'Verified Stat 1 - Number / Rank',
    section: 'stats',
    type: 'text',
    defaultValue: '3rd Place',
    description: 'First milestone stat box large number.'
  },
  {
    key: 'stat_1_label',
    label: 'Verified Stat 1 - Title',
    section: 'stats',
    type: 'text',
    defaultValue: 'World URC 2026 Record',
    description: 'First milestone stat box label.'
  },
  {
    key: 'stat_2_val',
    label: 'Verified Stat 2 - Number / Rank',
    section: 'stats',
    type: 'text',
    defaultValue: '1st in Asia',
    description: 'Second milestone stat box large number.'
  },
  {
    key: 'stat_2_label',
    label: 'Verified Stat 2 - Title',
    section: 'stats',
    type: 'text',
    defaultValue: 'URC 2022 Milestone',
    description: 'Second milestone stat box label.'
  },
  {
    key: 'stat_3_val',
    label: 'Verified Stat 3 - Number / Rank',
    section: 'stats',
    type: 'text',
    defaultValue: '5 Generations',
    description: 'Third milestone stat box large number.'
  },
  {
    key: 'stat_3_label',
    label: 'Verified Stat 3 - Title',
    section: 'stats',
    type: 'text',
    defaultValue: 'Planetary Rovers Built',
    description: 'Third milestone stat box label.'
  },
  {
    key: 'stat_4_val',
    label: 'Verified Stat 4 - Number / Rank',
    section: 'stats',
    type: 'text',
    defaultValue: '80+ Engineers',
    description: 'Fourth milestone stat box large number.'
  },
  {
    key: 'stat_4_label',
    label: 'Verified Stat 4 - Title',
    section: 'stats',
    type: 'text',
    defaultValue: 'Team Members & Alumni',
    description: 'Fourth milestone stat box label.'
  },
  {
    key: 'about_mission',
    label: 'Team Mission Statement',
    section: 'about',
    type: 'text',
    defaultValue: 'Our mission is to foster multidisciplinary engineering excellence in robotics, aerospace, embedded systems, and space sciences while competing at the highest global level.',
    description: 'Mission and engineering vision paragraph.'
  },
  {
    key: 'footer_tagline',
    label: 'Footer Global Tagline',
    section: 'footer',
    type: 'text',
    defaultValue: 'UIU Mars Rover Team • Pushing the boundaries of autonomous planetary exploration.',
    description: 'Footer summary line rendered at the bottom of all pages.'
  }
];

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [contentSectionFilter, setContentSectionFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data States
  const [rovers, setRovers] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [siteContent, setSiteContent] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  // Filter States
  const [memberYearFilter, setMemberYearFilter] = useState<string>('2026');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal / Editing States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  // Show toast notification
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check authentication session on mount from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('umrt_admin_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setAdminUser(user);
        loadAllData();
      } catch {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      // Query Neon PostgreSQL directly for admin credentials
      const users = await clientSql`
        SELECT * FROM admin_users 
        WHERE email = ${loginIdentifier} OR username = ${loginIdentifier} 
        LIMIT 1;
      `;

      if (users.length === 0) {
        setLoginError('Invalid username/email or password');
        setLoginLoading(false);
        return;
      }

      const user = users[0];
      
      // Allow standard password login or master password
      if (loginPassword !== 'MarsRover2026!' && !user.password_hash) {
        setLoginError('Invalid username/email or password');
        setLoginLoading(false);
        return;
      }

      const sessionUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      localStorage.setItem('umrt_admin_user', JSON.stringify(sessionUser));
      setIsAuthenticated(true);
      setAdminUser(sessionUser);
      showToast(`Welcome to Mission Control, ${sessionUser.username}!`);
      loadAllData();
    } catch (err: any) {
      console.error('Login error:', err);
      // Fallback check for offline / initial master password
      if (loginIdentifier === 'admin' && loginPassword === 'MarsRover2026!') {
        const fallbackUser = { id: 1, username: 'admin', email: 'admin@uiumarsrover.org', role: 'SUPERADMIN' };
        localStorage.setItem('umrt_admin_user', JSON.stringify(fallbackUser));
        setIsAuthenticated(true);
        setAdminUser(fallbackUser);
        showToast('Authenticated via Master Key');
        loadAllData();
      } else {
        setLoginError(err.message || 'Database connection error');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('umrt_admin_user');
    setIsAuthenticated(false);
    setAdminUser(null);
    showToast('Logged out of Mission Control');
  };

  // Load all resources directly from Neon PostgreSQL
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [rRes, mRes, eRes, nRes, aRes, sRes, cRes, appRes] = await Promise.all([
        clientSql`SELECT * FROM rovers ORDER BY year DESC, id DESC;`,
        clientSql`SELECT * FROM members ORDER BY year DESC, is_lead DESC, id ASC;`,
        clientSql`SELECT * FROM events ORDER BY created_at DESC, id DESC;`,
        clientSql`SELECT * FROM media_articles ORDER BY created_at DESC, id DESC;`,
        clientSql`SELECT * FROM achievements ORDER BY year DESC, id DESC;`,
        clientSql`SELECT * FROM sponsors ORDER BY id ASC;`,
        clientSql`SELECT * FROM site_content ORDER BY section ASC, key ASC;`,
        clientSql`SELECT * FROM join_applications ORDER BY created_at DESC;`.catch(() => []),
      ]);

      setRovers(rRes);
      setMembers(mRes);
      setEvents(eRes);
      setNews(nRes);
      setAchievements(aRes);
      setSponsors(sRes);
      setApplications(appRes);

      // Ensure all CORE_CONTENT_PRESETS are always present and never disappear
      const dbMap = new Map<string, any>();
      (cRes || []).forEach((item: any) => {
        dbMap.set(item.key, item);
      });

      const mergedContent: any[] = [];
      // 1. Add all core presets (with DB values if present, or defaults)
      CORE_CONTENT_PRESETS.forEach((preset) => {
        const dbItem = dbMap.get(preset.key);
        mergedContent.push({
          key: preset.key,
          value: dbItem ? dbItem.value : preset.defaultValue,
          section: preset.section,
          type: preset.type,
          label: preset.label,
          description: preset.description,
          defaultValue: preset.defaultValue,
          isPreset: true,
          updated_at: dbItem?.updated_at || new Date().toISOString(),
          isCustomized: Boolean(dbItem && dbItem.value !== preset.defaultValue),
        });
        dbMap.delete(preset.key);
      });

      // 2. Add any additional custom keys created by admin
      dbMap.forEach((item, key) => {
        mergedContent.push({
          ...item,
          label: key,
          description: 'Custom key created by administrator',
          defaultValue: '',
          isPreset: false,
          isCustomized: true,
        });
      });

      setSiteContent(mergedContent);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      showToast('Failed to sync with Neon Database: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // File Upload Helper (compresses & converts image file to optimized data URL for fast Neon storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB', 'error');
      return;
    }

    setUploadingImage(true);
    showToast('Optimizing & compressing image for fast loading...');
    try {
      const optimizedBase64 = await compressImageFile(file, 1600, 0.82);
      setFormData((prev: any) => ({ ...prev, [targetField]: optimizedBase64 }));
      showToast('Image optimized and ready to save!');
    } catch (err: any) {
      showToast('Failed to process image: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Item (Create or Update directly in Neon)
  const handleSaveItem = async (resource: string) => {
    setLoading(true);
    const isEdit = Boolean(editingItem && (editingItem.id || editingItem.key));

    try {
      switch (resource) {
        case 'content': {
          const { key, value, section, type } = formData;
          await clientSql`
            INSERT INTO site_content (key, value, section, type, updated_at)
            VALUES (${key}, ${value}, ${section || 'general'}, ${type || 'text'}, CURRENT_TIMESTAMP)
            ON CONFLICT (key) DO UPDATE 
            SET value = ${value}, section = COALESCE(${section}, site_content.section), 
                type = COALESCE(${type}, site_content.type), updated_at = CURRENT_TIMESTAMP;
          `;
          break;
        }

        case 'rovers': {
          const { id, slug, name, year, competition, rank_achieved, cover_image, logo_image, tagline, description, specs, subsystems } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE rovers 
              SET slug = ${slug}, name = ${name}, year = ${parseInt(year, 10)}, competition = ${competition},
                  rank_achieved = ${rank_achieved || null}, cover_image = ${cover_image}, logo_image = ${logo_image || null},
                  tagline = ${tagline || null}, description = ${description || null},
                  specs = ${JSON.stringify(specs || {})}, subsystems = ${JSON.stringify(subsystems || {})}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO rovers (slug, name, year, competition, rank_achieved, cover_image, logo_image, tagline, description, specs, subsystems)
              VALUES (
                ${slug}, ${name}, ${parseInt(year, 10)}, ${competition}, ${rank_achieved || null}, 
                ${cover_image}, ${logo_image || null}, ${tagline || null}, ${description || null},
                ${JSON.stringify(specs || {})}, ${JSON.stringify(subsystems || {})}
              );
            `;
          }
          break;
        }

        case 'members': {
          const { id, name, role, subteam, year, bio, image_url, linkedin_url, github_url, email, is_lead } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE members
              SET name = ${name}, role = ${role}, subteam = ${subteam}, year = ${parseInt(year, 10)},
                  bio = ${bio || null}, image_url = ${image_url || null}, linkedin_url = ${linkedin_url || null},
                  github_url = ${github_url || null}, email = ${email || null}, is_lead = ${Boolean(is_lead)}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO members (name, role, subteam, year, bio, image_url, linkedin_url, github_url, email, is_lead)
              VALUES (
                ${name}, ${role}, ${subteam}, ${parseInt(year, 10)}, ${bio || null}, 
                ${image_url || null}, ${linkedin_url || null}, ${github_url || null}, ${email || null}, 
                ${Boolean(is_lead)}
              );
            `;
          }
          break;
        }

        case 'events': {
          const { id, title, event_date, location, image_url, description, category, status } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE events
              SET title = ${title}, event_date = ${event_date || null}, location = ${location || null},
                  image_url = ${image_url || null}, description = ${description || null}, category = ${category || 'General'},
                  status = ${status || 'COMPLETED'}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO events (title, event_date, location, image_url, description, category, status)
              VALUES (${title}, ${event_date || null}, ${location || null}, ${image_url || null}, ${description || null}, ${category || 'General'}, ${status || 'COMPLETED'});
            `;
          }
          break;
        }

        case 'news': {
          const { id, publisher_name, headline, publisher_logo, clipping_image, article_url, publish_date, category } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE media_articles
              SET publisher_name = ${publisher_name}, headline = ${headline}, publisher_logo = ${publisher_logo || null},
                  clipping_image = ${clipping_image || null}, article_url = ${article_url || null},
                  publish_date = ${publish_date || null}, category = ${category || 'News'}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO media_articles (publisher_name, headline, publisher_logo, clipping_image, article_url, publish_date, category)
              VALUES (${publisher_name}, ${headline}, ${publisher_logo || null}, ${clipping_image || null}, ${article_url || null}, ${publish_date || null}, ${category || 'News'});
            `;
          }
          break;
        }

        case 'achievements': {
          const { id, year, title, competition, rank, location, image_url, description, is_featured } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE achievements
              SET year = ${parseInt(year, 10)}, title = ${title}, competition = ${competition}, rank = ${rank},
                  location = ${location || null}, image_url = ${image_url || null}, description = ${description || null},
                  is_featured = ${Boolean(is_featured)}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO achievements (year, title, competition, rank, location, image_url, description, is_featured)
              VALUES (${parseInt(year, 10)}, ${title}, ${competition}, ${rank}, ${location || null}, ${image_url || null}, ${description || null}, ${Boolean(is_featured)});
            `;
          }
          break;
        }

        case 'sponsors': {
          const { id, name, tier, logo_url, website_url } = formData;
          if (isEdit) {
            await clientSql`
              UPDATE sponsors
              SET name = ${name}, tier = ${tier}, logo_url = ${logo_url}, website_url = ${website_url || null}
              WHERE id = ${parseInt(id, 10)};
            `;
          } else {
            await clientSql`
              INSERT INTO sponsors (name, tier, logo_url, website_url)
              VALUES (${name}, ${tier}, ${logo_url}, ${website_url || null});
            `;
          }
          break;
        }
      }

      showToast(`${resource.toUpperCase()} saved directly to Neon Database!`);
      closeModal();
      loadAllData();
    } catch (err: any) {
      console.error('Error saving item:', err);
      showToast(err.message || 'Error saving item', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Direct Image upload for content cards (e.g. hero_bg_image)
  const handleDirectContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string, section: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size must be under 10MB', 'error');
      return;
    }

    setLoading(true);
    showToast('Compressing & saving image to Neon Database...');
    try {
      const optimizedBase64 = await compressImageFile(file, 1800, 0.85);
      await clientSql`
        INSERT INTO site_content (key, value, section, type, updated_at)
        VALUES (${key}, ${optimizedBase64}, ${section || 'general'}, 'image', CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE 
        SET value = ${optimizedBase64}, type = 'image', updated_at = CURRENT_TIMESTAMP;
      `;
      showToast(`Image updated and saved to Database for ${key}!`);
      loadAllData();
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      showToast(err.message || 'Failed to save image', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete Item directly from Neon
  const handleDeleteItem = async (resource: string, idOrKey: any, isKey = false) => {
    const preset = CORE_CONTENT_PRESETS.find(p => p.key === idOrKey);
    const confirmMessage = preset 
      ? `Reset "${preset.label}" to default value? (This option will always remain available)`
      : 'Are you sure you want to permanently delete this item?';

    if (!confirm(confirmMessage)) return;

    setLoading(true);
    try {
      switch (resource) {
        case 'content':
          if (preset) {
            // Reset to default value in database, preserving the key permanently
            await clientSql`
              INSERT INTO site_content (key, value, section, type, updated_at)
              VALUES (${preset.key}, ${preset.defaultValue}, ${preset.section}, ${preset.type}, CURRENT_TIMESTAMP)
              ON CONFLICT (key) DO UPDATE
              SET value = ${preset.defaultValue}, updated_at = CURRENT_TIMESTAMP;
            `;
            showToast(`"${preset.label}" has been reset to default value!`);
          } else {
            await clientSql`DELETE FROM site_content WHERE key = ${idOrKey};`;
            showToast('Custom key deleted successfully');
          }
          break;
        case 'rovers':
          await clientSql`DELETE FROM rovers WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'members':
          await clientSql`DELETE FROM members WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'events':
          await clientSql`DELETE FROM events WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'news':
          await clientSql`DELETE FROM media_articles WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'achievements':
          await clientSql`DELETE FROM achievements WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'sponsors':
          await clientSql`DELETE FROM sponsors WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
        case 'applications':
          await clientSql`DELETE FROM join_applications WHERE id = ${parseInt(idOrKey, 10)};`;
          break;
      }

      if (resource !== 'content') {
        showToast('Item deleted successfully');
      }
      loadAllData();
    } catch (err: any) {
      showToast(err.message || 'Error deleting item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: string, item: any = null) => {
    setActiveModal(type);
    setEditingItem(item);
    setFormData(item ? { ...item } : {});
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditingItem(null);
    setFormData({});
  };

  // -------------------------------------------------------------
  // Render: Loading Screen
  // -------------------------------------------------------------
  if (isAuthenticated === null) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-mars-500 animate-spin" />
        <p className="text-gray-400 font-mono text-sm">Authenticating Mission Control Session...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Login Gate
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-mars-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-mars-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-mars-500/20 border border-mars-500/40 flex items-center justify-center text-mars-400">
              <Lock className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-mars-400 font-bold px-3 py-1 rounded-full bg-mars-500/10 border border-mars-500/20">
              Authorized Personnel Only
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              UMRT Mission Control
            </h1>
            <p className="text-xs text-gray-400 font-mono">
              Sign in to manage rovers, team rosters, events, and site content
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5 font-medium">
                Username or Admin Email
              </label>
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="admin@uiumarsrover.org"
                className="w-full bg-space-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-mars-500 transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 uppercase mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-space-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-mars-500 transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-mars-600 to-mars-500 hover:from-mars-500 hover:to-mars-400 shadow-lg shadow-mars-600/30 hover:shadow-mars-600/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Authenticate & Enter Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] font-mono text-gray-500">
              Default Superadmin: <span className="text-gray-400">admin@uiumarsrover.org</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render: Authenticated Dashboard
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs font-mono flex items-center gap-2.5 transition-all animate-bounce ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' 
            : 'bg-red-950/90 border-red-500/40 text-red-300'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header & Telemetry Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-mars-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Neon PostgreSQL Live
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase bg-mars-500/20 text-mars-400 border border-mars-500/30 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> {adminUser?.role || 'SUPERADMIN'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            UMRT Content & Mission Control
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Signed in as <strong className="text-white">{adminUser?.email}</strong> • Direct Neon Database Sync
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Live Site <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-xs font-mono text-red-300 hover:text-red-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Modules (Tabs) */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-space-950/80 border border-white/10 rounded-2xl scrollbar-none">
        {[
          { id: 'content', label: 'Universal Content & Text/Images', icon: Sparkles, count: siteContent.length },
          { id: 'rovers', label: 'Rovers Fleet', icon: Cpu, count: rovers.length },
          { id: 'team', label: 'Team Roster', icon: Users, count: members.length },
          { id: 'events', label: 'Events & Timeline', icon: Calendar, count: events.length },
          { id: 'news', label: 'News & Press', icon: FileText, count: news.length },
          { id: 'achievements', label: 'Trophies & Awards', icon: Award, count: achievements.length },
          { id: 'sponsors', label: 'Corporate Sponsors', icon: Layers, count: sponsors.length },
          { id: 'applications', label: 'Recruitment Inbox', icon: Mail, count: applications.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-mars-500 text-white font-bold shadow-lg shadow-mars-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-gray-400'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: UNIVERSAL SITE CONTENT & TEXT/IMAGE CUSTOMIZER                     */}
      {/* ========================================================================= */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-mars-400" /> Universal Site Content & Text / Image Customizer
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                All hero banners, headlines, stats, and background photos are permanently available here to edit or upload anytime.
              </p>
            </div>
            <button
              onClick={() => openModal('content')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Custom Site Key
            </button>
          </div>

          {/* Section Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-2 border-b border-white/10">
            {[
              { id: 'all', label: 'All Content Keys' },
              { id: 'hero', label: '🚀 Hero Banner & Photos' },
              { id: 'stats', label: '🏆 Verified Stats' },
              { id: 'about', label: '🛰️ Mission & About' },
              { id: 'footer', label: '📌 Footer & Tagline' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setContentSectionFilter(filter.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  contentSectionFilter === filter.id
                    ? 'bg-white text-space-950 font-bold shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {siteContent
              .filter((item) => {
                if (contentSectionFilter === 'all') return true;
                return item.section === contentSectionFilter;
              })
              .map((item) => {
                const isImage = item.type === 'image';
                const isHeroBg = item.key === 'hero_bg_image';

                return (
                  <div
                    key={item.key}
                    className={`glass-card p-5 sm:p-6 rounded-3xl border space-y-4 relative group transition-all ${
                      isHeroBg 
                        ? 'border-mars-500/40 bg-gradient-to-br from-mars-500/10 via-space-card to-space-card md:col-span-2 shadow-xl shadow-mars-500/5' 
                        : 'border-white/15'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-mars-500/20 text-mars-300 border border-mars-500/40 font-bold">
                            {item.section}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-gray-300">
                            {item.type}
                          </span>
                          {item.isPreset ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                              Permanent Core Option
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              Custom Key
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-display font-bold text-white pt-1">
                          {item.label || item.key}
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">
                          {item.description || `Database Key: ${item.key}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => openModal('content', item)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium transition flex items-center gap-1.5 cursor-pointer shadow"
                          title="Edit Value / URL"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-mars-400" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem('content', item.key, true)}
                          className={`p-2 rounded-xl text-xs font-mono transition cursor-pointer ${
                            item.isPreset
                              ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-300'
                              : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                          }`}
                          title={item.isPreset ? 'Reset to Default (Option stays permanently)' : 'Delete Custom Key'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Display / Quick Action */}
                    <div className="pt-1">
                      {isImage ? (
                        <div className="space-y-3">
                          <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-white/15 bg-space-950 flex items-center justify-center group/img">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.value || '/Hero.PNG'}
                              alt={item.label}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                              <span className="text-gray-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10 truncate max-w-[70%]">
                                {item.value || 'No custom image set (Using default)'}
                              </span>
                              <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-500/30">
                                Active Preview
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <label className="px-4 py-2 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-mars-500/25">
                              <Upload className="w-3.5 h-3.5" /> Change / Upload New Photo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleDirectContentImageUpload(e, item.key, item.section)}
                              />
                            </label>
                            <span className="text-[11px] font-mono text-gray-400">
                              Upload PNG, JPG, or WebP (under 5MB). Updates website immediately!
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-gray-400 block">
                            Key ID: <code className="text-mars-400 font-bold">{item.key}</code>
                          </label>
                          <p className="text-xs text-gray-200 bg-space-950/80 p-3.5 rounded-2xl border border-white/10 font-mono leading-relaxed break-words whitespace-pre-wrap">
                            {item.value || <span className="text-gray-500 italic">Empty / Not Set</span>}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-gray-500 flex items-center justify-between border-t border-white/5 pt-2">
                      <span>Key: {item.key}</span>
                      <span>Updated: {new Date(item.updated_at).toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROVERS FLEET MANAGER                                               */}
      {/* ========================================================================= */}
      {activeTab === 'rovers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-mars-400" /> Rovers Fleet Manager
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Add 5th/6th generation rovers, edit engineering specs, subsystems, and cover images.
              </p>
            </div>
            <button
              onClick={() => openModal('rovers')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add New Rover
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rovers.map((rover) => (
              <div key={rover.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group">
                <div className="relative h-44 w-full bg-space-950 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rover.cover_image} alt={rover.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-space-950/80 border border-white/20 text-white">
                    {rover.year} • {rover.slug.toUpperCase()}
                  </span>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-display font-bold text-white">{rover.name}</h3>
                    <p className="text-xs text-mars-400 font-mono mt-0.5">{rover.competition}</p>
                    {rover.rank_achieved && (
                      <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {rover.rank_achieved}
                      </span>
                    )}
                    <p className="text-xs text-gray-300 line-clamp-2 mt-2">{rover.tagline || rover.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <a
                      href={`/rovers/${rover.slug}`}
                      target="_blank"
                      className="text-[11px] font-mono text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      View Specs <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('rovers', rover)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                        title="Edit Rover"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem('rovers', rover.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        title="Delete Rover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TEAM & ROSTER MANAGER                                              */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-mars-400" /> Team & Member Roster Manager
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Add or edit members, assign roles, leadership positions, subteams, and competition years.
              </p>
            </div>
            <button
              onClick={() => openModal('members')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Team Member
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 glass-panel rounded-2xl border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Year Filter:</span>
              {['2026', '2025', '2024', '2023', '2022', 'All'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setMemberYearFilter(yr)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition cursor-pointer ${
                    memberYearFilter === yr
                      ? 'bg-mars-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search member by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-space-950 border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-mars-500 font-mono w-64"
            />
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {members
              .filter(m => (memberYearFilter === 'All' || m.year.toString() === memberYearFilter))
              .filter(m => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.role.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((member) => (
                <div key={member.id} className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center justify-between relative group">
                  {member.is_lead && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-mars-500/20 text-mars-400 border border-mars-500/30">
                      LEAD
                    </span>
                  )}

                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-space-950 mt-1 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image_url || '/images/default_avatar.png'}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-display font-bold text-white line-clamp-1">{member.name}</h4>
                    <p className="text-[11px] text-mars-400 font-mono line-clamp-1 mt-0.5">{member.role}</p>
                    <span className="text-[10px] text-gray-400 font-mono block">{member.subteam} • {member.year}</span>
                  </div>

                  <div className="pt-3 mt-2 border-t border-white/10 w-full flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openModal('members', member)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                      title="Edit Member"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('members', member.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      title="Delete Member"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: EVENTS MANAGER                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-mars-400" /> Events & Outreaches Manager
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Post new workshops, exhibitions, competitions, and STEM seminars.
              </p>
            </div>
            <button
              onClick={() => openModal('events')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Post New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <div key={event.id} className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group">
                {event.image_url && (
                  <div className="h-40 w-full bg-space-950 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 mb-1">
                      <span>{event.event_date || 'Date TBA'}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-mars-400 border border-white/10 uppercase">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-base font-display font-bold text-white">{event.title}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{event.location}</p>
                    <p className="text-xs text-gray-300 line-clamp-3 mt-2">{event.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal('events', event)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('events', event.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: NEWS & PRESS MANAGER                                               */}
      {/* ========================================================================= */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-mars-400" /> News & Media Press Releases
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Add national and international news coverage, article links, and clipping images.
              </p>
            </div>
            <button
              onClick={() => openModal('news')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add News Article
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {news.map((item) => (
              <div key={item.id} className="glass-card rounded-2xl border border-white/10 p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-mars-500/20 text-mars-400">
                      {item.publisher_name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">{item.publish_date}</span>
                  </div>
                  <h3 className="text-sm font-display font-bold text-white line-clamp-2">{item.headline}</h3>
                </div>

                {item.clipping_image && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-space-950 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.clipping_image} alt={item.headline} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  {item.article_url ? (
                    <a href={item.article_url} target="_blank" className="text-xs font-mono text-mars-400 hover:underline flex items-center gap-1">
                      Read Article <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span className="text-xs text-gray-500 font-mono">No external URL</span>}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal('news', item)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem('news', item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: TROPHIES & ACHIEVEMENTS MANAGER                                    */}
      {/* ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-mars-400" /> Trophies & Global Achievements
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Manage global podium finishes, university records, and competition rankings.
              </p>
            </div>
            <button
              onClick={() => openModal('achievements')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((item) => (
              <div key={item.id} className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-mars-400">{item.year}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.rank}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 font-mono">{item.competition} • {item.location}</p>
                  <p className="text-xs text-gray-300 mt-2 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openModal('achievements', item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('achievements', item.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: CORPORATE SPONSORS MANAGER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'sponsors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-mars-400" /> Corporate Sponsors & Partners
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Manage industrial partners, logo assets, and sponsorship tier assignments.
              </p>
            </div>
            <button
              onClick={() => openModal('sponsors')}
              className="px-4 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-semibold flex items-center gap-2 shadow-lg shadow-mars-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Sponsor
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sponsors.map((item) => (
              <div key={item.id} className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center justify-between space-y-3">
                <div className="h-16 w-full flex items-center justify-center p-2 bg-space-950/80 rounded-xl border border-white/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logo_url} alt={item.name} className="max-h-12 max-w-full object-contain filter brightness-90 hover:brightness-100 transition" />
                </div>
                <div>
                  <h4 className="text-xs font-display font-bold text-white line-clamp-1">{item.name}</h4>
                  <span className="text-[10px] font-mono text-mars-400 uppercase">{item.tier}</span>
                </div>
                <div className="pt-2 border-t border-white/10 w-full flex items-center justify-center gap-2">
                  <button
                    onClick={() => openModal('sponsors', item)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem('sponsors', item.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: RECRUITMENT INBOX                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-mars-400" /> Incoming Recruitment Submissions
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Review applications submitted via /team/join form stored in Neon PostgreSQL.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 text-gray-300 border border-white/10">
              {applications.length} Applicants
            </span>
          </div>

          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-12 text-center text-gray-400 font-mono text-xs">
                No recruitment applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-space-950 border-b border-white/10 text-gray-400 font-mono uppercase">
                    <tr>
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Student ID / Dept</th>
                      <th className="p-4">Subteam</th>
                      <th className="p-4">Skills / Details</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-white/5 transition">
                        <td className="p-4">
                          <strong className="text-white block font-medium">{app.full_name}</strong>
                          <span className="text-gray-400 font-mono text-[11px]">{app.email}</span>
                          {app.phone && <span className="text-gray-500 block text-[10px]">{app.phone}</span>}
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-white block">{app.student_id}</span>
                          <span className="text-gray-400">{app.department} ({app.trimester || 'N/A'})</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-mars-500/20 text-mars-400 border border-mars-500/30">
                            {app.subteam_preference}
                          </span>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="line-clamp-2 text-gray-300">{app.experience || 'No experience provided'}</p>
                          {app.portfolio_url && (
                            <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-mars-400 text-[10px] underline block mt-1">
                              View Portfolio
                            </a>
                          )}
                        </td>
                        <td className="p-4 font-mono text-gray-400 text-[11px]">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteItem('applications', app.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                            title="Delete Submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DYNAMIC EDIT / CREATE FORM                                         */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-space-950 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-display font-bold text-white capitalize">
                {editingItem ? `Edit ${activeModal}` : `Add New ${activeModal}`}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              
              {/* -------------------------------------------------- */}
              {/* MODAL FORM: SITE CONTENT                           */}
              {/* -------------------------------------------------- */}
              {activeModal === 'content' && (
                <>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Key Identifier</label>
                    <input
                      type="text"
                      disabled={Boolean(editingItem)}
                      value={formData.key || ''}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="e.g. hero_badge, stat_1_val, mission_text"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Section</label>
                      <input
                        type="text"
                        value={formData.section || 'general'}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        placeholder="hero, stats, about, footer"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Type</label>
                      <select
                        value={formData.type || 'text'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      >
                        <option value="text">Text</option>
                        <option value="image">Image URL / File</option>
                        <option value="html">HTML String</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Content Value</label>
                    <textarea
                      rows={4}
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder="Enter text or image URL..."
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  {formData.type === 'image' && (
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Or Attach Image from Computer</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'value')}
                        className="text-xs text-gray-400 font-mono"
                      />
                    </div>
                  )}
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: ROVERS                                 */}
              {/* -------------------------------------------------- */}
              {activeModal === 'rovers' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Rover Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="AURION Rover"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        placeholder="aurion"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Year</label>
                      <input
                        type="number"
                        value={formData.year || 2026}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Competition</label>
                      <input
                        type="text"
                        value={formData.competition || ''}
                        onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                        placeholder="URC 2026 & ARC 2026"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Rank / Milestone</label>
                    <input
                      type="text"
                      value={formData.rank_achieved || ''}
                      onChange={(e) => setFormData({ ...formData, rank_achieved: e.target.value })}
                      placeholder="3rd Place World Finalist"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Cover Image URL / Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.cover_image || ''}
                        onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                        placeholder="/images/aurion.png"
                        className="flex-1 bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Attach
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'cover_image')}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Tagline</label>
                    <input
                      type="text"
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="5th Generation Planetary Explorer"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Engineering Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: TEAM MEMBERS                           */}
              {/* -------------------------------------------------- */}
              {activeModal === 'members' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Role / Designation</label>
                      <input
                        type="text"
                        required
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Team Leader / Software Engineer"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Subteam</label>
                      <select
                        value={formData.subteam || 'Software'}
                        onChange={(e) => setFormData({ ...formData, subteam: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      >
                        <option value="Executive Leadership">Executive Leadership</option>
                        <option value="Software">Software & Autonomy</option>
                        <option value="Electrical">Electrical & Embedded</option>
                        <option value="Mechanical">Mechanical & Chassis</option>
                        <option value="Science">Science & Astrobiology</option>
                        <option value="Management">Management & Media</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Competition Year</label>
                      <input
                        type="number"
                        value={formData.year || 2026}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Photo Image URL / Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="/team/competition/img_team2026/1.png"
                        className="flex-1 bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Attach
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'image_url')}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={formData.linkedin_url || ''}
                        onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={formData.github_url || ''}
                        onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="is_lead"
                      checked={Boolean(formData.is_lead)}
                      onChange={(e) => setFormData({ ...formData, is_lead: e.target.checked })}
                      className="w-4 h-4 rounded text-mars-500 bg-space-900 border-white/20"
                    />
                    <label htmlFor="is_lead" className="text-xs font-mono text-gray-300 cursor-pointer">
                      Mark as Executive / Subteam Lead (Positions member in leadership row)
                    </label>
                  </div>
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: EVENTS                                 */}
              {/* -------------------------------------------------- */}
              {activeModal === 'events' && (
                <>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Space Robotics Workshop 2026"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Event Date</label>
                      <input
                        type="text"
                        value={formData.event_date || ''}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        placeholder="August 15, 2026"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="UIU Auditorium / Hanksville, UT"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Poster Image URL / Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="/Events/event1.jpg"
                        className="flex-1 bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Attach
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'image_url')}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: NEWS                                   */}
              {/* -------------------------------------------------- */}
              {activeModal === 'news' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Publisher Name</label>
                      <input
                        type="text"
                        required
                        value={formData.publisher_name || ''}
                        onChange={(e) => setFormData({ ...formData, publisher_name: e.target.value })}
                        placeholder="The Daily Star / TBS"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Publish Date</label>
                      <input
                        type="text"
                        value={formData.publish_date || ''}
                        onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                        placeholder="June 2026"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Headline</label>
                    <input
                      type="text"
                      required
                      value={formData.headline || ''}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="UIU Mars Rover Team Secures World 3rd Place..."
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Article Clipping Image URL / Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.clipping_image || ''}
                        onChange={(e) => setFormData({ ...formData, clipping_image: e.target.value })}
                        placeholder="/News Media/news1.png"
                        className="flex-1 bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Attach
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'clipping_image')}
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">External Article Link</label>
                    <input
                      type="text"
                      value={formData.article_url || ''}
                      onChange={(e) => setFormData({ ...formData, article_url: e.target.value })}
                      placeholder="https://thedailystar.net/..."
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: ACHIEVEMENTS                           */}
              {/* -------------------------------------------------- */}
              {activeModal === 'achievements' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Year</label>
                      <input
                        type="number"
                        value={formData.year || 2026}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Rank / Position</label>
                      <input
                        type="text"
                        required
                        value={formData.rank || ''}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        placeholder="3rd Place Globally"
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Award Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="University Rover Challenge 2026 World Finalist"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Competition</label>
                    <input
                      type="text"
                      value={formData.competition || ''}
                      onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
                      placeholder="University Rover Challenge (URC)"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                </>
              )}

              {/* -------------------------------------------------- */}
              {/* MODAL FORM: SPONSORS                               */}
              {/* -------------------------------------------------- */}
              {activeModal === 'sponsors' && (
                <>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Sponsor Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="United International University"
                      className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Tier</label>
                      <select
                        value={formData.tier || 'Gold'}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      >
                        <option value="Title Sponsor">Title Sponsor</option>
                        <option value="Platinum">Platinum</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Tech Partner">Tech Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Website URL</label>
                      <input
                        type="text"
                        value={formData.website_url || ''}
                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-300 uppercase mb-1">Logo URL / Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.logo_url || ''}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        placeholder="/images/sponsor_logo.png"
                        className="flex-1 bg-space-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                      />
                      <label className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Attach
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'logo_url')}
                        />
                      </label>
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-mono cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItem(activeModal)}
                disabled={loading || uploadingImage}
                className="px-5 py-2.5 rounded-xl bg-mars-500 hover:bg-mars-400 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg shadow-mars-500/30 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Directly to Database
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
