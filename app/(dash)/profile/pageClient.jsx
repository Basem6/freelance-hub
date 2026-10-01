'use client';
//core
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
//hooks
import { useAppSelector } from '@/app/lib/hooks';
//reduxs
import api from '@/app/utils/api';
//motion
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
// icons
import { MapPin, Briefcase,ExternalLink,Pen,Plus,ChevronLeft,ChevronRight} from 'lucide-react';
//ui
import Avatar from '../../../components/ui/Avatar';
import Skillsmodel from '../../../components/profile/Skillsmodel';
//animation
import { fadeUp, staggerContainer } from '../../lib/constants/animations';
import Portfoliomodel from '../../../components/profile/Portfoliomodel';
import Languagesmodel from '../../../components/profile/Languagesmodel';
import { Ellipsis } from 'lucide-react';

export default function PageClient() {
const user = useAppSelector(state => state.auth.user);
const technicalData= useAppSelector(state => state.technicalData);
const [model , setmodel ] = useState(null)
const [Projects , setProjects] = useState([])
const [setProjectsLoading] = useState(false)
const [visiblePortfolioCards, setVisiblePortfolioCards] = useState(3)
const [portfolioCarouselIndex, setPortfolioCarouselIndex] = useState(0)
const [portfolioTouchStartX, setPortfolioTouchStartX] = useState(null)
const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
const portfolioItems = Array.isArray(technicalData.portfolio) ? technicalData.portfolio : []
const portfolioMaxPage = Math.max(0, Math.ceil(portfolioItems.length / visiblePortfolioCards) - 1)
const portfolioStartIndex = portfolioCarouselIndex * visiblePortfolioCards
const shouldShowPortfolioArrows = user?.role === 'freelancer' && portfolioItems.length > visiblePortfolioCards

useEffect(() => {
    const handleResize = () => {
        setVisiblePortfolioCards(window.innerWidth < 768 ? 4 : 3)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}, [])

useEffect(() => {
    setPortfolioCarouselIndex(0)
}, [portfolioItems.length, visiblePortfolioCards])

const goToPreviousPortfolio = () => {
    setPortfolioCarouselIndex((current) => Math.max(0, current - 1))
}

const goToNextPortfolio = () => {
    setPortfolioCarouselIndex((current) => Math.min(current + 1, portfolioMaxPage))
}

const handlePortfolioTouchStart = (event) => {
    setPortfolioTouchStartX(event.touches[0].clientX)
}

const handlePortfolioTouchEnd = (event) => {
    if (portfolioTouchStartX === null) return

    const deltaX = event.changedTouches[0].clientX - portfolioTouchStartX
    if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) goToNextPortfolio()
        else goToPreviousPortfolio()
    }
    setPortfolioTouchStartX(null)
}

useEffect(()=>{
    const ds= async  function (){
    if (user?.role === 'client') {
        setProjectsLoading(true);
        try {
            const projectRes = await api.get('/my-projects');
            const backendProjects = projectRes?.data?.projects ?? projectRes?.data ?? [];
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

return (
    <div className="flex flex-col  h-fit  md:p-8 max-w-7xl mx-auto  gap-3.5 ">
    {/* Main Content */}
    
    <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6 rounded-2xl border border-gray-300/60 "
    >
        {/* Section 1: Hero Card */}
        <motion.div variants={fadeUp} className=" border-b border-gray-300/60  overflow-hidden ">
        
        {/* Profile Info */}
        <div className="md:px-6 px-1 py-8 relative ">
            <div className="flex flex-row gap-5 md:px-0 relative px-5 items-center  mb-2">
            <div className='size-19 overflow-hidden'>
                <Avatar user={user} online={true}></Avatar>
                
            </div>
            <div className="flex-1 pb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                <h2 className="md:text-3xl  text-2xl text-[#111111]">{user?.fullName || 'User Name'}</h2>
                </div>
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
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl  ">
            <h3 className="text-2xl text-[#111111] mb-4">{user?.major || 'Freelancer'}</h3>
                <p className="text-gray-600 leading-relaxed">
                {user?.bio||
                "Passionate UI/UX Designer with 5+ years creating scalable web applications and beautiful user interfaces."}
                </p>
            </motion.div>:""}
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl ">
            <div className='flex justify-between min-w-full items-center'> 
                <h3 className="text-2xl text-[#111111]">Education</h3>
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'>                     <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> {technicalData?.education.length?<Pen className='text-orange-400 hover:text-orange-600 ' size={15}></Pen>:<Plus className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200 transition-colors transition-transform' size={15}></Plus>}</div></div>
            </div>
            <div className="space-y-4">
            </div>
            </motion.div>
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl">
            <div className='flex justify-between min-w-full items-center'> 
                <h3 className="text-2xl text-[#111111]">Languages</h3>
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'>                     <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> {technicalData?.languages.length?<Pen  className='text-orange-400 hover:text-orange-600 ' size={15}></Pen>:<Plus onClick={()=>{setmodel("languages")}} className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200 transition-colors transition-transform' size={15}></Plus>}</div></div>
            </div>
            <div className="space-y-4">
            </div>
            </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 border-l border-gray-200/40 space-y-6">
            
            {/* Skills */}
            
            <motion.div variants={fadeUp} className="bg-white p-6 ">
            <div className='flex justify-between min-w-full items-center'> 
                <h3 className="text-2xl text-[#111111]">Skills</h3>
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> {technicalData?.skills.length?<Pen onClick={()=>{setmodel("skills")}} className='text-orange-400 hover:text-orange-600 ' size={15}></Pen>:<Plus onClick={()=>{setmodel("skills")}} className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200 transition-colors transition-transform' size={15}></Plus>}</div>
            </div>
                    

                <div className={`flex pt-3 gap-2 ${technicalData?.skills.length?"justify-start":"justify-center"} flex-wrap`}>
                
                {technicalData?.skills.length>0?technicalData?.skills.map((skill, i) => (
                
                <div key={i} className=''>
                    
                    
                        <span  className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-sm text-sm font-medium hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors cursor-pointer flex items-center gap-1">
                        {skill}
                        </span>

                    
                </div>
                
                )):
                <div className='flex justify-center flex-col gap-3 items-center'>
                <div className='overflow-hidden'>
                    <Image 
                    src={"/photoMeaning/Shape.svg"}
                    alt='user'
                    width={40}
                    height={40}
                    loading='lazy'
                    quality={10}
                    className='object-contain h-full w-fit'
                    >
                    </Image>
                </div>
                <div className='text-sm text-gray-800/60'>You have no skills , <a className='hover:border-b border-orange-400 text-orange-500' onClick={()=>{setmodel("skills")}}>Add skills</a></div>
                </div>
                }
                </div>
            
            </motion.div>

            {/* Portfolio / Projects Preview */}
            <motion.div
            variants={fadeUp}
            className=" border-t md:w-190 border-gray-300/60 bg-white p-6 "
            >
            <div className="mb-6 flex items-center justify-between gap-3">
                <h3 className="text-2xl text-[#111111]">
                {user?.role === "freelancer"
                    ? "Portfolio"
                    : "My Projects"}
                </h3>

                <div className="flex items-center gap-2">
                
                <div

                className="text-sm font-medium text-[#FF7A00] transition-colors hover:text-orange-600"
                >
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'><Plus onClick={()=>{setmodel("portfolio");if(document.querySelector(".parent")){document.querySelector(".parent").classList.add("noscrol")}}} className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200  transition-transform' size={15}></Plus></div></div>
                </div>
                </div>
            </div>

            <div className="relative min-h-36 overflow-hidden" onTouchStart={handlePortfolioTouchStart} onTouchEnd={handlePortfolioTouchEnd}>
                {user?.role === "freelancer" ? (
                portfolioItems.length > 0 ? (
                    <div className="flex gap-3 md:flex-nowrap  flex-wrap min-w-full">
                    {portfolioItems.slice(portfolioStartIndex, portfolioStartIndex + visiblePortfolioCards).map((item, i) => (
                        <div
                        key={item._id || `portfolio-${i}`}
                        className="group relative flex   h-40   w-[47%] flex-col gap-1.5 overflow-hidden rounded-sm transition-all md:h-48 cursor-pointer"
                        >
                        <div className="w-full h-full overflow-hidden rounded-sm">
                            <img
                                src={
                                item.coverImage ||
                                DEFAULT_COVER_IMAGE
                                }
                                alt={item.title || "Portfolio work"}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        <div>
                            <h4 className=" text-sm text-gray-800">
                            {item.title||"Untitled Project"}
                            </h4>
                        </div>
                        <div   className="absolute  bg-white  size-8 border flex items-center justify-center rounded-full border-orange-400 top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <Ellipsis size={16} className="text-orange-400" />
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-58 ">
                                <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7A00] mb-4">
                                    <Briefcase size={40} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No works found</h3>
                                <p className="text-gray-500 mb-6">There are no works matching your criteria.</p>

                    </div>
                )
                ) : (
                user?.role ==="client"? (
                    <div className="flex min-w-full flex-wrap gap-3">
                    {Projects?.slice(0, 3).map((project) => {
                        const pid = project.id ?? project._id;

                        return (
                        <Link
                            href={`/projects/${pid}`}
                            key={pid}
                            className="w-50 grow overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-3 shadow-sm transition hover:shadow-md"
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

                        
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                            {(project.skills || []).map(
                                (skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                >
                                    {skill}
                                </span>
                                )
                            )}
                            </div>
                        </Link>
                        );
                    })}
                    </div>
                ) : (
                    <div className="flex min-h-36 items-center justify-center">
                        <p className="text-lg font-medium text-gray-400">
                            No Projects yet
                        </p>
                    </div>
                )
                )}
            </div>
            {shouldShowPortfolioArrows && (
                    <div className="flex gap-3 mt-2 justify-end">
                    <button type="button" onClick={goToPreviousPortfolio} disabled={portfolioCarouselIndex === 0} aria-label="Previous portfolio projects" className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-orange-300 hover:text-[#FF7A00] disabled:opacity-40">
                        <ChevronLeft size={16} />
                    </button>
                    <button type="button" onClick={goToNextPortfolio} disabled={portfolioCarouselIndex >= portfolioMaxPage} aria-label="Next portfolio projects" className="flex size-8 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:border-orange-300 hover:text-[#FF7A00] disabled:opacity-40">
                        <ChevronRight size={16} />
                    </button>
                    </div>
                )}
            </motion.div>
        </div>
        </div>
    </motion.div>

    <motion.div
            variants={fadeUp}
            className='rounded-2xl    border border-gray-300/60 bg-white p-6'>
            <div className='flex justify-between min-w-full items-center'> 
                <h3 className="text-2xl text-[#111111]">Experience</h3>
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'>                     <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> {technicalData?.experience.length?<Pen className='text-orange-400 hover:text-orange-600 ' size={15}></Pen>:<Plus className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200 transition-colors transition-transform' size={15}></Plus>}</div></div>
            </div>
            
            <div className='flex min-h-65 justify-center items-center flex-col'>
                <div>
                <Image
                src={"photoMeaning/icons8-file-192.svg"}
                alt='icon'
                width={100}
                height={100}
                quality={10}
                className='object-contain w-full h-full'
                >

                </Image>
                </div>
                <div className=' text-gray-800/60'>Add Any Experience to help you grow</div>
                <button className='text-orange-500/90 my-2 hover:text-orange-500  border-b border-white   hover:border-orange-400'>Add Experience</button>
            </div>

    </motion.div>
    {/*window overlay*/}
    <AnimatePresence>
        {model ==="skills" && <Skillsmodel setmodel={setmodel} />}
        {model ==="portfolio" && <Portfoliomodel setmodel={setmodel} />}
        {model ==="languages" && <Languagesmodel setmodel={setmodel} />}
    </AnimatePresence>
    </div>
);
}
