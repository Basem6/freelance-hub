'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks';
import { logout } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import { Briefcase, CalendarDays, DollarSign, Sparkles, Tag, PlusCircle, CheckCircle2 } from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Web Development',
  'UI/UX Design',
  'Mobile App',
  'Branding',
  'Marketing',
  'Data Science',
  'Other',
];

const initialProject = {
  title: '',
  category: 'Web Development',
  budget: '',
  deadline: '',
  description: '',
  remote: true,
};

export default function ProjectsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(initialProject);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (!res.data.success) {
          dispatch(logout());
          router.push('/login');
          return;
        }

      } catch (error) {
        dispatch(logout());
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);
  
  useEffect(()=>{
    const ds= async  function (){
    if (user?.role === 'client') {
          setProjectsLoading(true);
          try {
            const projectRes = await api.get('/my-projects');
            console.log(projectRes)
            const backendProjects = projectRes?.data?.projects ?? projectRes?.data ?? [];
            console.log(projectRes)
            console.log(backendProjects)
            setProjects(Array.isArray(backendProjects) ? backendProjects : []);
          } catch (error) {
            console.error('Error fetching client projects:', error);
          } finally {
            setProjectsLoading(false);
          }
    }
  }
  ds()
  },[])
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProjectData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const skill = skillInput.trim();
    if (!skill) return;
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!projectData.title || !projectData.description || !projectData.budget || skills.length === 0) {
      setMessageType('error');
      setMessage('Please complete the title, description, budget, and add at least one skill.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const payload = {
      ...projectData,
      skills,
    };

    try {
      const response = await api.post('/api/client/addproject', payload);
      const createdProject = response?.data?.project ?? {
        id: Date.now(),
        ...payload,
        createdAt: new Date().toLocaleDateString(),
      };

      setProjects((prev) => [createdProject, ...prev]);
      setProjectData(initialProject);
      setSkills([]);
      setSkillInput('');
      setMessageType('success');
      setMessage('Project created successfully!');
      setShowCreateForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error?.response?.data?.message || 'Unable to create project. Please try again.';
      setMessageType('error');
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center md:ml-64 px-6">
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-gray-200">
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pageTitle = user?.role === 'client' ? 'Client Projects' : 'Freelancer Projects';
  const pageSubtitle = user?.role === 'client'
    ? 'Manage the jobs you posted and share them with freelancers.'
    : 'Create and manage your service offers for clients.';
  const listTitle = user?.role === 'client' ? 'Your posted projects' : 'Your project listings';

  return (
    <div className="min-h-screen bg-[#F8F8F8] text-[#111111] md:ml-64">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#FF7A00]">{pageTitle}</p>
              <h1 className="mt-3 text-3xl font-semibold">{pageSubtitle}</h1>
              <p className="mt-3 text-sm text-gray-600 max-w-2xl">
                {pageSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition"
            >
              <PlusCircle size={18} />
              {showCreateForm ? 'Hide form' : 'Add New Project'}
            </button>
          </div>
          {message && (
            <div className={`mt-6 rounded-2xl px-4 py-3 text-sm ${messageType === 'success' ? 'border border-green-200 bg-green-50 text-green-800' : 'border border-red-200 bg-red-50 text-red-800'}`}>
              <CheckCircle2 className="inline-block mr-2 align-text-top" size={16} />
              {message}
            </div>
          )}

          {showCreateForm && (
            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Project title
                <input
                  name="title"
                  value={projectData.title}
                  onChange={handleChange}
                  placeholder="e.g. UI design system for SaaS platform"
                  className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Budget estimate
                <div className="relative">
                  <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={projectData.budget}
                    onChange={handleChange}
                    placeholder="e.g. $1,200 - $2,500"
                    className="w-full rounded-3xl border border-gray-200 bg-white px-11 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                  />
                </div>
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Category
                <select
                  name="category"
                  value={projectData.category}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Deadline
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="deadline"
                    value={projectData.deadline}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-gray-200 bg-white px-11 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Description
                <textarea
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Explain the scope, deliverables, and client value."
                  className="w-full rounded-3xl border border-gray-200 bg-white px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20"
                />
              </label>
              <div className="space-y-4">
                <label className="space-y-2 text-sm font-medium text-gray-700">
                  Required skills
                  <div className="flex flex-col gap-3 rounded-3xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <input
                        value={skillInput}
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={handleSkillKeyDown}
                        placeholder="Press Enter to add skill"
                        className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#FF7A00] focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const skill = skillInput.trim();
                          if (skill && !skills.includes(skill)) {
                            setSkills((prev) => [...prev, skill]);
                          }
                          setSkillInput('');
                        }}
                        className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-500"
                      >
                        <PlusCircle size={16} /> Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.length === 0 ? (
                        <span className="text-sm text-gray-400">Add at least one skill</span>
                      ) : (
                        skills.map((skill) => (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => handleRemoveSkill(skill)}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                          >
                            <Tag size={14} />
                            {skill}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </label>
                <label className="inline-flex items-center gap-3 rounded-3xl border border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-700 transition hover:border-[#FF7A00]">
                  <input
                    type="checkbox"
                    name="remote"
                    checked={projectData.remote}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-gray-300 text-[#FF7A00] focus:ring-[#FF7A00]"
                  />
                  Remote friendly project
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">Your created projects are saved to the backend and loaded from the database.</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#FF7A00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-200"
              >
                {isSubmitting ? 'Creating...' : 'Create project'}
              </button>
            </div>
          </form>
        )}
        </div>

        <section className="space-y-6">
         
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400">Your projects</p>
              <h2 className="text-2xl font-semibold">Created listings</h2>
            </div>
            <p className="text-sm text-gray-500">{projects.length} {projects.length === 1 ? 'project' : 'projects'} created</p>
          </div>

          {projectsLoading ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              Loading projects from the database...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              No projects yet. Create your first listing to make it easy for clients to discover your service.
            </div>
          ) : (
            <div className="grid gap-6">
              {projects.map((project) => {
                const pid = project.id ?? project._id;
                return (
                  <Link
                    href={`/projects/${pid}`}
                    key={pid}
                    className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
                          <Briefcase size={16} />
                          {project.category}
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-[#111111]">{project.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-gray-600">{project.description}</p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-gray-400">
                          {user?.role === 'client' ? 'Posted by you' : 'Created by you'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start gap-2 text-sm text-gray-500 sm:items-end">
                        <span>Budget: <span className="font-semibold text-gray-900">{project.budget}</span></span>
                        <span>Deadline: <span className="font-semibold text-gray-900">{project.deadline || 'Flexible'}</span></span>
                        <span>Remote: <span className="font-semibold text-gray-900">{project.remote ? 'Yes' : 'No'}</span></span>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {(project.skills || []).map((skill) => (
                        <span key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{skill}</span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
