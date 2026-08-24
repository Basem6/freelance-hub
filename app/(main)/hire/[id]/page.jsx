'use client';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';
import { Star, MapPin, Globe, Award, BookOpen, Clock, Calendar , BadgeCheck, Heart, Circle, CheckCircle} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import ProfileHeader from '@/components/profile/ProfileHeader';
import SkillTags from '@/components/profile/SkillTags';
import PortfolioGrid from '@/components/profile/PortfolioGrid';
import ReviewCard from '@/components/profile/ReviewCard';
import ServiceCard from '@/components/profile/ServiceCard';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../utils/api';
import Link from 'next/link';

export default function Page() {
    const user = useAppSelector(state => state.auth.user);
    const router = useRouter();
    const [person, setperson] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    useEffect(() => {
      if (!id) return;
      const fetchProject = async () => {
        setLoading(true);
          try {
            const res = await api.get(`/freelancers/${id}`);
            console.log(res?.data.freelancer)
            setperson(res?.data.freelancer);
            return;
          } catch (error) {
          console.error('Error loading project:', error);
          setperson(null);
          } finally {
            setLoading(false);
          }
        }
      fetchProject();
    }, [id]);
  console.log(person)

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F8F8] pb-20 animate-pulse">
        <div className="bg-white rounded-b-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative w-full h-[120px] bg-white" />
          <div className="relative px-6 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div className="flex flex-col md:flex-row md:items-end flex-1">
                <div className="relative -mt-16 z-10 w-32 h-32 md:mr-6 mb-4 md:mb-0 rounded-full border-4 border-white bg-gray-200 shadow-md" />
                <div className="flex flex-col pb-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-52 bg-gray-200 rounded-md" />
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    <div className="h-5 w-24 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-5 w-72 bg-gray-200 rounded-md mb-3" />
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="h-4 w-28 bg-gray-200 rounded-md" />
                    <div className="h-4 w-32 bg-gray-200 rounded-md" />
                    <div className="h-4 w-20 bg-gray-200 rounded-md" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 md:mt-0 pb-2">
                <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                <div className="h-12 w-32 bg-gray-200 rounded-lg" />
                <div className="h-12 w-32 bg-[#F4F4F5] rounded-lg" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-y-4 justify-between md:justify-start md:gap-12">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex flex-col gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded-md" />
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 lg:px-8 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                  <div className="h-6 w-28 bg-gray-200 rounded-md mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded-md" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
                    <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <div className="h-6 w-40 bg-gray-200 rounded-md mb-4" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((tag) => (
                    <div key={tag} className="h-8 w-20 bg-gray-200 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
                <div className="h-6 w-36 bg-gray-200 rounded-md mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((card) => (
                    <div key={card} className="h-24 bg-gray-200 rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[#F8F8F8] pb-20">
      <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-b-2xl shadow-sm overflow-hidden mb-6"
    >
      {/* Cover Image */}
      <div className="relative w-full h-[120px] bg-gradient-to-r from-white via-white to-white">
        <div className="absolute top-4 right-4 flex space-x-2">
          {/* Optional actions inside cover */}
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          
          {/* Left side: Avatar + Info */}
          <div className="flex flex-col md:flex-row md:items-end gap-4.5 flex-1">
            <div className="size-30 rounded-full overflow-hidden">
              <Image
                src={person?.image || "/avatars/avatar-1.png"}
                alt={person?.fullName || "Client"}
                width={30}
                height={30}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex flex-col pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{person?.fullName}</h1>
                <BadgeCheck className="w-6 h-6 text-blue-500" />
                <span className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Top Rated Plus</span>
              </div>
              <h2 className="text-lg text-gray-600 font-medium mb-2">{person?.major||"Senior UI/UX Designer & Frontend Developer"}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {person?.country ||"San Francisco, CA"}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" /> 
                  <span className="font-semibold text-gray-900">{person?.rate || "3.4"}</span> 
                  <span>({ "247 reviews"})</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Available
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Action Buttons */}
          <div className="flex items-center gap-3 mt-6 md:mt-0 pb-2">
            <button
              onClick={() => router.push(`/messages?userId=${person?._id || person?.id}`)}
              disabled={!person?._id && !person?.id}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold  rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Message
            </button>
            <a
              href={`mailto:${person?.email}`}
              className="inline-block px-8 py-3 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              Hire Me
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-y-4 justify-between md:justify-start md:gap-12">
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{person?.projectcomplete / person?.projectAppied * 100||0}</span>
            <span className="text-sm text-gray-500 font-medium">Job Success</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">{person?.projectcomplete||0}</span>
            <span className="text-sm text-gray-500 font-medium">Jobs Completed</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">2h</span>
            <span className="text-sm text-gray-500 font-medium">Response Time</span>
          </div>
        </div>
      </div>
      </motion.div>
      <div className=" px-4 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left sticky sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* About Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-3">About Me</h3>
              {person?.bio? <p className='text-gray-600 text-sm leading-relaxed mb-4 min-h-40 max-h-40' >{person?.bio}</p>:
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                I am an award-winning UI/UX designer and frontend developer with over 8 years of experience building scalable web applications and premium digital experiences.
                <br /><br />
                My hybrid skillset allows me to bridge the gap between design and engineering, ensuring pixel-perfect implementations of beautiful interfaces.
              </p>}
              {person?.bio && person.bio.length > 170 &&
              <button className="text-[#FF7A00] font-semibold text-sm hover:underline">Read more</button>
              }
            </motion.div>

            {/* Languages */}
            {person?.Languages&&
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" /> Languages
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700 font-medium">English</span>
                  <span className="text-gray-500">Native</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#FF7A00] h-1.5 rounded-full w-full"></div></div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-gray-700 font-medium">Arabic</span>
                  <span className="text-gray-500">Fluent</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#FF7A00] h-1.5 rounded-full w-4/5"></div></div>
                
                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-gray-700 font-medium">French</span>
                  <span className="text-gray-500">Basic</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-[#FF7A00] h-1.5 rounded-full w-1/3"></div></div>
              </div>
            </motion.div>
            }

            {/* Education & Certs */}
            {person?.Education&&
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-400" /> Education
              </h3>
              <div className="mb-6">
                <p className="font-semibold text-gray-900 text-sm">Stanford University</p>
                <p className="text-gray-500 text-sm">B.S. Computer Science</p>
                <p className="text-gray-400 text-xs mt-1">2014 - 2018</p>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-400" /> Certifications
              </h3>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Google UX Design Professional</p>
                <p className="text-gray-500 text-sm">Google</p>
                <p className="text-gray-400 text-xs mt-1">Issued Jan 2022</p>
              </div>
            </motion.div>
            }

          </div>
          
          {/* Right main content */}
          {person?.skills&&
          <div className="lg:col-span-2 space-y-6"> 
            <SkillTags skillsData ={person?.skills}/>
          </div>
          }
          <div className="lg:col-span-3 ">
              <PortfolioGrid user={person} />
            </div>
           {/* Work History / Reviews */}
            <div className="bg-white lg:col-span-3 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Work History & Feedback</h2>
              
              {/* Rating Summary */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  <h3 className="text-5xl font-black text-gray-900 mb-2">4.9</h3>
                  <div className="flex text-[#FF7A00] mb-2">
                    <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">247 Reviews</span>
                </div>
                
                {/* Bar Chart */}
                <div className="flex-1 w-full space-y-2">
                  {[
                    { stars: 5, pct: 92 },
                    { stars: 4, pct: 6 },
                    { stars: 3, pct: 1 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-12 text-right">{row.stars} stars</span>
                      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: `${row.pct}%` }}></div>
                      </div>
                      <span className="w-8">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-1">
                <ReviewCard 
                  name="Michael D."
                  avatar="from-blue-400 to-blue-600"
                  rating={5}
                  date="Oct 12, 2023"
                  amount="$4,500"
                  project="Fintech SaaS Dashboard"
                  text="Alexandra is an exceptional talent. She completely transformed our MVP into a world-class product. Her attention to detail and understanding of complex user flows is unmatched. Delivered ahead of schedule!"
                />
                <ReviewCard 
                  name="Sarah W."
                  avatar="from-pink-400 to-pink-600"
                  rating={5}
                  date="Sep 28, 2023"
                  amount="$1,200"
                  project="E-commerce Redesign"
                  text="Working with Alex was a breeze. She quickly grasped our brand identity and created a stunning, modern frontend. The Framer Motion animations she added really make the site pop. Highly recommend!"
                />
                <ReviewCard 
                  name="David L."
                  avatar="from-green-400 to-green-600"
                  rating={5}
                  date="Aug 15, 2023"
                  amount="$2,800"
                  project="Health & Fitness App"
                  text="Brilliant work! She nailed the mobile-first responsive design perfectly. The code quality is excellent and very easy for my backend team to integrate with. Will definitely hire again."
                />
                <ReviewCard 
                  name="Emma R."
                  avatar="from-purple-400 to-purple-600"
                  rating={4}
                  date="Jul 02, 2023"
                  amount="$850"
                  project="Landing Page Optimization"
                  text="Great design skills and fast turnaround. The new landing page is converting much better than our old one. Communication was professional throughout the project."
                />
              </div>
              <div className="mt-2 text-center">
                <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                  Load More Reviews
                </button>
              </div>
            </div>
          
        </div>
      </div>
    </main>
  );
}