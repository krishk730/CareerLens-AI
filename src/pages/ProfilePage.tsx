import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Briefcase,
  Compass,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth, calculateProfileScore } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserProfile } from '../types/index';
import { CircularProgress } from '../components/CircularProgress';

export function ProfilePage() {
  const { userProfile, updateProfile } = useAuth();
  const { showToast } = useNotifications();

  // Local editable form state
  const [profile, setProfile] = useState<UserProfile>(() => {
    return userProfile || {
      userId: 'current-user',
      fullName: 'Alex Rivera',
      email: 'alex.rivera@university.edu',
      college: 'California State University',
      currentYear: '3rd Year (Junior)',
      careerGoal: 'Full Stack Software Engineer',
      skills: {
        programmingLanguages: ['Python', 'TypeScript', 'JavaScript', 'SQL'],
        frameworks: ['React', 'Next.js', 'Express', 'Tailwind CSS'],
        databases: ['PostgreSQL', 'MongoDB'],
        dataScience: ['Pandas', 'NumPy'],
        softSkills: ['Problem Solving', 'Teamwork', 'Agile'],
        other: ['Git', 'REST APIs', 'Docker Basics']
      },
      projects: [],
      certificates: [],
      experience: [],
      preferences: {
        targetRole: 'Full Stack Software Engineer',
        preferredLocation: 'San Francisco / Remote',
        workType: 'remote',
        jobType: 'internship'
      },
      profileScore: 75
    };
  });

  const [saving, setSaving] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState<{ category: keyof UserProfile['skills']; value: string }>({
    category: 'programmingLanguages',
    value: ''
  });

  const profileScore = calculateProfileScore(profile);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profile);
      showToast('Career profile updated and saved successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save profile. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (category: keyof UserProfile['skills']) => {
    if (!newSkillInput.value.trim()) return;
    const currentList = profile.skills[category] || [];
    if (!currentList.includes(newSkillInput.value.trim())) {
      setProfile({
        ...profile,
        skills: {
          ...profile.skills,
          [category]: [...currentList, newSkillInput.value.trim()]
        }
      });
    }
    setNewSkillInput({ ...newSkillInput, value: '' });
  };

  const removeSkill = (category: keyof UserProfile['skills'], skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: {
        ...profile.skills,
        [category]: (profile.skills[category] || []).filter(s => s !== skillToRemove)
      }
    });
  };

  const addProject = () => {
    const newProj = {
      id: `proj_${Date.now()}`,
      name: 'New Portfolio Project',
      description: 'Describe key architectural choices, user impact, and quantifiable performance results.',
      technologies: ['React', 'TypeScript', 'Node.js'],
      githubUrl: 'https://github.com/username/project',
      liveUrl: 'https://demo.app'
    };
    setProfile({
      ...profile,
      projects: [newProj, ...(profile.projects || [])]
    });
  };

  const removeProject = (id: string) => {
    setProfile({
      ...profile,
      projects: (profile.projects || []).filter(p => p.id !== id)
    });
  };

  const addExperience = () => {
    const newExp = {
      id: `exp_${Date.now()}`,
      company: 'Tech Company / University Lab',
      role: 'Software / Data Intern',
      duration: 'Summer 2025 (3 Months)',
      description: 'Implemented features, refactored queries, and collaborated with cross-functional engineers.'
    };
    setProfile({
      ...profile,
      experience: [newExp, ...(profile.experience || [])]
    });
  };

  const removeExperience = (id: string) => {
    setProfile({
      ...profile,
      experience: (profile.experience || []).filter(e => e.id !== id)
    });
  };

  const addCertificate = () => {
    const newCert = {
      id: `cert_${Date.now()}`,
      name: 'Cloud or Technical Certification',
      organization: 'Google Cloud / AWS / Coursera',
      issueDate: '2025',
      credentialUrl: ''
    };
    setProfile({
      ...profile,
      certificates: [newCert, ...(profile.certificates || [])]
    });
  };

  const removeCertificate = (id: string) => {
    setProfile({
      ...profile,
      certificates: (profile.certificates || []).filter(c => c.id !== id)
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Top Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl">
                {profile.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {profile.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {profile.careerGoal || 'Technology & Engineering'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.college} • {profile.currentYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <CircularProgress
            value={profileScore}
            size={90}
            strokeWidth={7}
            sublabel="Completeness"
          />
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Section 1: Personal & Contact */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Personal & Contact Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / City</label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              placeholder="e.g. San Jose, CA"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={profile.linkedin || ''}
              onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Code Portfolio</label>
            <input
              type="url"
              value={profile.github || ''}
              onChange={e => setProfile({ ...profile, github: e.target.value })}
              placeholder="https://github.com/username"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Education */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Academic Background
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">College / University</label>
            <input
              type="text"
              value={profile.college || ''}
              onChange={e => setProfile({ ...profile, college: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
            <input
              type="text"
              value={profile.degree || ''}
              onChange={e => setProfile({ ...profile, degree: e.target.value })}
              placeholder="e.g. Bachelor of Science"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch / Major</label>
            <input
              type="text"
              value={profile.branch || ''}
              onChange={e => setProfile({ ...profile, branch: e.target.value })}
              placeholder="e.g. Computer Science"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Year</label>
            <input
              type="text"
              value={profile.currentYear || ''}
              onChange={e => setProfile({ ...profile, currentYear: e.target.value })}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Graduation Year</label>
            <input
              type="text"
              value={profile.graduationYear || ''}
              onChange={e => setProfile({ ...profile, graduationYear: e.target.value })}
              placeholder="e.g. 2026"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">CGPA / Percentage</label>
            <input
              type="text"
              value={profile.cgpa || ''}
              onChange={e => setProfile({ ...profile, cgpa: e.target.value })}
              placeholder="e.g. 3.82 / 4.0"
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Technical & Soft Skills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Code2 className="w-4 h-4 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Verified Skill Inventory
          </h2>
        </div>

        {/* Skill Add Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <select
            value={newSkillInput.category}
            onChange={e => setNewSkillInput({ ...newSkillInput, category: e.target.value as any })}
            className="text-xs p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white font-medium cursor-pointer"
          >
            <option value="programmingLanguages">Programming Languages</option>
            <option value="frameworks">Frameworks & Libraries</option>
            <option value="databases">Databases & Storage</option>
            <option value="dataScience">Data Science & AI</option>
            <option value="softSkills">Soft Skills & Methodologies</option>
            <option value="other">Tools, DevOps & Cloud</option>
          </select>

          <input
            type="text"
            value={newSkillInput.value}
            onChange={e => setNewSkillInput({ ...newSkillInput, value: e.target.value })}
            placeholder="Type skill name (e.g. Docker, Redis, PyTorch)..."
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(newSkillInput.category);
              }
            }}
            className="flex-1 min-w-[200px] text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />

          <button
            type="button"
            onClick={() => addSkill(newSkillInput.category)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill
          </button>
        </div>

        {/* Categorized Chips */}
        <div className="space-y-4">
          {[
            { key: 'programmingLanguages', label: 'Languages' },
            { key: 'frameworks', label: 'Frameworks' },
            { key: 'databases', label: 'Databases' },
            { key: 'dataScience', label: 'Data Science & AI' },
            { key: 'softSkills', label: 'Soft Skills' },
            { key: 'other', label: 'DevOps & Tools' }
          ].map(({ key, label }) => {
            const list = profile.skills[key as keyof UserProfile['skills']] || [];
            return (
              <div key={key}>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  {label} ({list.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {list.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(key as any, skill)}
                        className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {list.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No {label.toLowerCase()} added yet.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Projects */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Highlighted Projects
            </h2>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        <div className="space-y-4">
          {profile.projects?.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={proj.name}
                  onChange={e => {
                    const updated = [...profile.projects];
                    updated[idx].name = e.target.value;
                    setProfile({ ...profile, projects: updated });
                  }}
                  className="font-bold text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 dark:text-white focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                  title="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={2}
                value={proj.description}
                onChange={e => {
                  const updated = [...profile.projects];
                  updated[idx].description = e.target.value;
                  setProfile({ ...profile, projects: updated });
                }}
                className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={proj.githubUrl || ''}
                  onChange={e => {
                    const updated = [...profile.projects];
                    updated[idx].githubUrl = e.target.value;
                    setProfile({ ...profile, projects: updated });
                  }}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
                <input
                  type="url"
                  placeholder="Live Demo URL"
                  value={proj.liveUrl || ''}
                  onChange={e => {
                    const updated = [...profile.projects];
                    updated[idx].liveUrl = e.target.value;
                    setProfile({ ...profile, projects: updated });
                  }}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>
            </div>
          ))}
          {(!profile.projects || profile.projects.length === 0) && (
            <p className="text-xs text-slate-400 italic py-2">No projects added yet.</p>
          )}
        </div>
      </div>

      {/* Section 5: Experience & Internships */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Experience & Internships
            </h2>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </button>
        </div>

        <div className="space-y-4">
          {profile.experience?.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={exp.role}
                  onChange={e => {
                    const updated = [...profile.experience];
                    updated[idx].role = e.target.value;
                    setProfile({ ...profile, experience: updated });
                  }}
                  placeholder="Role (e.g. Software Intern)"
                  className="font-bold text-sm bg-transparent border-b border-slate-300 dark:border-slate-600 dark:text-white focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeExperience(exp.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Company / Organization"
                  value={exp.company}
                  onChange={e => {
                    const updated = [...profile.experience];
                    updated[idx].company = e.target.value;
                    setProfile({ ...profile, experience: updated });
                  }}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. May 2025 - August 2025)"
                  value={exp.duration}
                  onChange={e => {
                    const updated = [...profile.experience];
                    updated[idx].duration = e.target.value;
                    setProfile({ ...profile, experience: updated });
                  }}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                />
              </div>

              <textarea
                rows={2}
                value={exp.description}
                onChange={e => {
                  const updated = [...profile.experience];
                  updated[idx].description = e.target.value;
                  setProfile({ ...profile, experience: updated });
                }}
                placeholder="Bullet points describing responsibilities and achievements..."
                className="w-full text-xs p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white focus:outline-none"
              />
            </div>
          ))}
          {(!profile.experience || profile.experience.length === 0) && (
            <p className="text-xs text-slate-400 italic py-2">No experience entries added yet.</p>
          )}
        </div>
      </div>

      {/* Save Button Float at bottom */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving changes...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
}
