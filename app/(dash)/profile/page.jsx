'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Camera, 
  CheckCircle, 
  Edit2, 
  Save, 
  X,
  Briefcase,
  Star,
  Clock,
  Zap,
  Globe,
  Award,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [Projects , setProjects] = useState([])
  const [ProjectsLoading , setProjectsLoading] = useState(false)
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => {
        console.log(res)
        if (!res.data.success) { dispatch(logout()); router.push('/login'); }
      })
      .catch(() => { dispatch(logout()); router.push('/login'); })
      .finally(() => setLoading(false));
  }, []);
  
    useEffect(()=>{
    const ds= async  function (){
    if (user?.role === 'client') {
          setProjectsLoading(true);
          try {
            const projectRes = await api.get('/my-projects');
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
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
      dispatch(logout());
      router.push('/');
    } catch (error) { console.error('Logout failed:', error); }
  };  
  console.log(Projects)
  if (loading) {
    return (
      <div className="flex h-screen bg-[#F8F8F8]">
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0 animate-pulse" />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex h-screen bg-[#F8F8F8] overflow-hidden md:ml-64">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Section 1: Hero Card */}
            <motion.div variants={fadeUp} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Banner */}
              <div className="h-28 relative group">
                <div className="" />
              </div>
              
              {/* Profile Info */}
              <div className="px-6 pb-8 relative">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-4">
                  <div className="relative z-10">
                      <img 
                        src={user?.image || "/avatars/avatar-1.png"}  
                        alt={user?.fullName || 'User'} 
                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                      />
                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                      <CheckCircle className="text-blue-500 w-6 h-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1 pb-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <h2 className="text-3xl font-bold text-[#111111]">{user?.fullName || 'User Name'}</h2>
                      {user?.role==="freelancer"?
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 w-fit">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Available for work
                      </div>:""}
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue="UI/UX Designer & Frontend Developer" 
                        className="w-full md:max-w-md px-3 py-2 border-2 border-orange-200 focus:border-[#FF7A00] rounded-xl outline-none text-gray-700 mb-2 transition-colors"
                      />
                    ) : (
                      <p className="text-lg text-gray-600 font-medium mb-2">{user?.major ||""}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{user?.country || "San Francisco, CA"}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-gray-300" />

                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>

            {/* Section 3: Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
              
              {/* Left Column */}
              <div className="space-y-6">
                
                {/* About */}
                {user?.role==="freelancer"?
                <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#111111] mb-4">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {user?.bio||
                      "Passionate UI/UX Designer with 5+ years creating scalable web applications and beautiful user interfaces."}
                    </p>
                </motion.div>:""}

                {/* Contact Info */}
                <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-[#111111] mb-4">Contact Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                        <span className="font-medium truncate">{user?.email || 'email@example.com'}</span>
                    </div>
                    {user?.country&&
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                        <span className="font-medium">{user?.country}</span>
                    </div>}
                    {user?.phone &&
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                        <span className="font-medium">{user?.phone}</span>
                    </div>
                    }
                  </div>
                </motion.div>

              

              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Skills */}
                {user?.role==="freelancer"?
                <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

                  <div className="space-y-6">
                    {[
                      { category: 'Skills', skills:user?.skills || ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Redux'] },
                    ].map((group, i) => (
                      <div key={i}>
                        <h4 className="text-black  font-bold tracking-wider mb-3">{group.category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.skills.map((skill, j) => (
                            <span key={j} className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors cursor-pointer flex items-center gap-1">
                              {skill}
                              {isEditing && <X size={14} className="text-gray-400 hover:text-red-500" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>:""}


                {/* Portfolio Preview */}
                <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[#111111]">{user?.role==="freelancer"?"Portfolio Works":"My Projecets"}</h3>
                    <Link href={user?.role==="freelancer"?"/my-works":"/projects"}>
                    <button className="text-sm font-medium text-[#FF7A00] hover:text-orange-600 flex items-center gap-1 transition-colors">
                      {user?.role==="freelancer"?"View All Works":"View All Projects"}&rarr;
                    </button>
                    </Link>
                  </div>
                  
                  <div className=" flex gap-4 min-h-36 relative">
                    {user?.portfolio?.length > 0 ? (
  user.portfolio.map((item, i) => (
    <div
      key={item._id || `portfolio-${i}`}
      className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
    >
      <div className="h-48 relative overflow-hidden">
        <img
          src={item.coverImage || DEFAULT_COVER_IMAGE}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          {item.liveUrl && (
            <Link href={item.liveUrl}>
              <button className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#FF7A00] transition-colors">
                <ExternalLink size={20} />
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

      <div className="absolute bottom-4 left-4 right-4">
        <h4 className="text-white font-bold text-lg">
          {item.title}
        </h4>

        <p className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
          View Project
        </p>
      </div>
    </div>
  ))
) : user?.postedProjects?.length > 0 ? (
  <div className=' flex gap-3 flex-wrap min-w-full'>
  {Projects.map((project) => {
    const pid = project.id ?? project._id;
    return (
      <Link
        href={`/projects/${pid}`}
        key={pid}
        className="rounded-3xl w-50 overflow-hidden grow   border border-gray-200 bg-white px-6 py-3 shadow-sm hover:shadow-md transition"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">
              <Briefcase size={16} />
              {project.category}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-[#111111]">
              {project.title}
            </h3>

            

            
          </div>

          <div className="flex flex-col items-start gap-2 text-sm text-gray-500 sm:items-end">
            <span>
              Budget:{" "}
              <span className="font-semibold text-gray-900">
                {project.budget}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {(project.skills || []).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </Link>
      );
    })}
  </div>
  ) : (
    <p className="text-gray-500 absolute left-1/2 top-1/3 -translate-x-1/2 text-2xl">
      No {user?.role === "freelancer" ? "portfolio work" : "projects"} yet
    </p>
  )}
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
