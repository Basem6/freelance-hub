'use client';
//core
import { useEffect, useRef, useState } from 'react';
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
import { MapPin, Ellipsis ,Briefcase,ExternalLink,Pen,Plus,ChevronLeft,ChevronRight,ChevronDown} from 'lucide-react';
//ui
import Avatar from '../../../components/ui/Avatar';
import Portfoliomodel from '../../../components/profile/Portfoliomodel';
import Languagesmodel from '../../../components/profile/Languagesmodel';
import ProfileRecordModel from '../../../components/profile/ProfileRecordModel';
import Skillsmodel from '../../../components/profile/Skillsmodel';
//utils 
import  { registerOutsideClick, unregisterOutsideClick } from '@/app/hooks/ClickOutside'
//animation
import gsap from 'gsap';
import { fadeUp, staggerContainer } from '../../lib/constants/animations';
import Experiencemodel from '../../../components/profile/ExperienceModel';
import Deletemodel from '../../../components/profile/Deletemodel';

export default function PageClient() {
const user = useAppSelector(state => state.auth.user);
const technicalData= useAppSelector(state => state.technicalData);
const [model , setmodel ] = useState(null)
const [Projects , setProjects] = useState([])
const [projectsLoading, setProjectsLoading] = useState(false)
const [visiblePortfolioCards, setVisiblePortfolioCards] = useState(3)
const [portfolioCarouselIndex, setPortfolioCarouselIndex] = useState(0)
const [portfolioTouchStartX, setPortfolioTouchStartX] = useState(null)
const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null)
const [bioExpanded, setBioExpanded] = useState(false)
const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
const portfolioItems = Array.isArray(technicalData.portfolio) ? technicalData.portfolio : []
const freelancerBio = technicalData?.bio || "Passionate UI/UX Designer with 5+ years creating scalable web applications and beautiful user interfaces."
const shouldCollapseBio = freelancerBio.length > 200
const portfolioMaxPage = Math.max(0, Math.ceil(portfolioItems.length / visiblePortfolioCards) - 1)
const portfolioStartIndex = portfolioCarouselIndex * visiblePortfolioCards
const shouldShowPortfolioArrows = user?.role === 'freelancer' && portfolioItems.length > visiblePortfolioCards

const [activeMenu, setActiveMenu] = useState(null);
const portfolioMenuRefs = useRef(new Map());

const getPortfolioMenuRef = (id) => {
    let menuRef = portfolioMenuRefs.current.get(id);
    if (!menuRef) {
        menuRef = { current: null };
        portfolioMenuRefs.current.set(id, menuRef);
    }
    return menuRef;
};
const handleEditPortfolio = (item) => {
    setSelectedPortfolioItem(item);
    setmodel('portfolio');
};
const handleDeletePortfolio = async (item) => {  
setmodel("DeletePortfolio")
setSelectedPortfolioItem(item)

}
const closePortfolioMenu = (id, menuRef) => {
    const menu = menuRef.current?.querySelector('[data-portfolio-menu-panel]');
    unregisterOutsideClick(menuRef);
    if (!menu) {
        setActiveMenu((current) => current === id ? null : current);
        return;
    }

    gsap.killTweensOf(menu);
    gsap.to(menu, {
        opacity: 0,
        y: 8,
        duration: 0.2,
        onComplete: () => {
            setActiveMenu((current) => current === id ? null : current);
            unregisterOutsideClick(menuRef);
        },
    });
};

const togglePortfolioMenu = (id, menuRef) => {
    if (activeMenu === id) {
        closePortfolioMenu(id, menuRef);
        return;
    }

    setActiveMenu(id);
    requestAnimationFrame(() => {
        const menu = menuRef.current?.querySelector('[data-portfolio-menu-panel]');
        if (!menu) return;

        gsap.fromTo(menu, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2 });
        registerOutsideClick(menuRef, () => closePortfolioMenu(id, menuRef));
    });
};

useEffect(() => () => {
    portfolioMenuRefs.current.forEach((menuRef) => {
        const menu = menuRef.current?.querySelector('[data-portfolio-menu-panel]');
        if (menu) gsap.killTweensOf(menu);
        unregisterOutsideClick(menuRef);
    });
}, []);

useEffect(() => {
    if (activeMenu === null) return;

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            const menuRef = portfolioMenuRefs.current.get(activeMenu);
            if (menuRef) closePortfolioMenu(activeMenu, menuRef);
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [activeMenu]);
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
    <div className="flex flex-col  overflow-hidden  h-fit  md:p-8 max-w-7xl mx-auto  gap-3.5 ">
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
            <div className='size-25 overflow-hidden'>
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

            {user?.role==="freelancer"?
            <motion.div variants={fadeUp} className="bg-white p-6 rounded-2xl  ">
            <h3 className="text-2xl text-[#111111] mb-4">{technicalData?.major || 'Freelancer'}</h3>
                <motion.p
                    id="freelancer-bio"
                    animate={{ height: !shouldCollapseBio || bioExpanded ? 'auto' : '4.875rem' }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden text-gray-600 leading-relaxed"
                >
                    {freelancerBio}
                </motion.p>
                {shouldCollapseBio && (
                    <button
                        type="button"
                        aria-expanded={bioExpanded}
                        aria-controls="freelancer-bio"
                        onClick={() => setBioExpanded((expanded) => !expanded)}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
                    >
                        {bioExpanded ? 'Show less' : 'Show more'}
                        <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className={`transition-transform duration-300 ${bioExpanded ? 'rotate-180' : 'rotate-0'}`}
                        />
                    </button>
                )}
            </motion.div>:""}
            <motion.div
                variants={fadeUp}
                className="rounded-2xl bg-white px-6"
            >
                <div className="flex min-w-full items-center justify-between">
                    <h3 className="text-2xl text-[#111111]">
                        Education
                    </h3>

                    <button
                        type="button"
                        onClick={() => setmodel("education")}
                        className="flex size-7 items-center justify-center rounded-full border border-orange-400"
                    >
                        <Plus
                            className="text-orange-400 transition-all duration-200 hover:rotate-180 hover:text-orange-600"
                            size={15}
                        />
                    </button>
                </div>

                <div className="mt-3">
                    {technicalData?.education?.length > 0 ? (
                        technicalData.education.map((education, index) => (
                            <div
                                key={education._id || index}
                                className="flex flex-col gap-1 border-b border-gray-100 pb-4 last:border-0"
                            >
                                {/* School */}
                                <div className="text-base font-medium text-black/95">
                                    {education.school}
                                </div>

                                {/* Degree */}
                                {education.degree && (
                                    <div className="text-sm text-gray-700/80">
                                        {education.degree}
                                    </div>
                                )}

                                {/* Field */}
                                {education.fieldOfStudy && (
                                    <div className="text-sm text-gray-500">
                                        {education.fieldOfStudy}
                                    </div>
                                )}

                                {/* Date */}
                                {(education.startYear || education.endYear) && (
                                    <div className="text-xs text-gray-400">
                                        {education.startYear }
                                        {education.startYear  &&
                                        education.endYear 
                                            ? " — "
                                            : ""}
                                        {education.endYear}
                                    </div>
                                )}

                                {/* Description */}
                                {education.description && (
                                    <p className="mt-1 text-sm leading-6 text-gray-500">
                                        {education.description}
                                    </p>
                                )}
                            </div>
                        ))
                    ) : (
                        ""
                    )}
                </div>
            </motion.div>
            <motion.div
            variants={fadeUp}
            className="rounded-2xl bg-white p-6"
            >
                
            <div className="flex items-center justify-between">
                <h3 className="text-2xl  text-[#111111]">
                Languages
                </h3>

                <div className="flex items-center gap-3">
                {technicalData?.languages?.length > 0 && (
                    <button
                    type="button"
                    onClick={() => setmodel("Editlanguages")}
                    className="flex size-7 items-center justify-center rounded-full border border-orange-400 transition-colors hover:bg-orange-50"
                    >
                    <Pen
                        size={15}
                        className="text-orange-400 transition-colors hover:text-orange-600"
                    />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setmodel("Newlanguage")}
                    className="flex size-7 items-center justify-center rounded-full border border-orange-400 transition-all duration-200 hover:bg-orange-50"
                >
                    <Plus
                    size={15}
                    className="text-orange-400 transition-all duration-200 hover:rotate-180 hover:text-orange-600"
                    />
                </button>
                </div>
            </div>

            {/* Languages */}
            <div className="mt-4 flex flex-col gap-3">
                {technicalData?.languages?.length > 0 ? (
                technicalData.languages.map((item, index) => (
                    <div
                    key={`${item.language}-${index}`}
                    className="flex items-center gap-2 text-sm text-gray-600"
                    >
                    <span className="text-gray-900">
                        {item.language}:
                    </span>

                    <span className=' text-gray-800/70'>{item.proficiency}</span>
                    </div>
                ))
                ) : (   ""
                )}
            </div>
            </motion.div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-2  border-l border-gray-200/40 space-y-6">
            
            {/* Skills */}
            
            <motion.div variants={fadeUp} className="bg-white p-6 ">
            <div className='flex justify-between min-w-full items-center'> 
                <h3 className="text-2xl text-[#111111]">Skills</h3>
                <div className='size-7 rounded-full border border-orange-400 flex justify-center items-center'> {technicalData?.skills?.length?<Pen onClick={()=>{setmodel("skills")}} className='text-orange-400 hover:text-orange-600 ' size={15}></Pen>:<Plus onClick={()=>{setmodel("skills")}} className='text-orange-400 hover:text-orange-600 hover:rotate-180 duration-200 transition-colors transition-transform' size={15}></Plus>}</div>
            </div>
                    

                <div className={`flex pt-3 gap-2 ${technicalData?.skills?.length?"justify-start":"justify-center"} flex-wrap`}>
                
                {technicalData?.skills?.length>0?technicalData?.skills?.map((skill, i) => (
                
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
            className=" border-t w-full border-gray-300/60 bg-white p-6 "
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

            <div className="relative min-h-36 " aria-busy={projectsLoading} onTouchStart={handlePortfolioTouchStart} onTouchEnd={handlePortfolioTouchEnd}>
                {user?.role === "freelancer" ? (
                portfolioItems.length > 0 ? (
                    <div className="flex gap-3 md:flex-nowrap  flex-wrap min-w-full">
                    {portfolioItems.slice(portfolioStartIndex, portfolioStartIndex + visiblePortfolioCards).map((item, i) => {
                        const portfolioItemId = item._id || `portfolio-${portfolioStartIndex + i}`;
                        const menuRef = getPortfolioMenuRef(portfolioItemId);
                        return (
                        <div
                        key={portfolioItemId}
                        className="group relative flex w-[47.6%]     h-40   md:w-[32%] flex-col gap-1.5  rounded-sm  md:h-48 cursor-pointer"
                        >
                            <div className="w-full h-full overflow-hidden rounded-sm">
                                <img
                                    src={
                                    item.coverImage ||
                                    DEFAULT_COVER_IMAGE
                                    }
                                    alt={item.title || "Portfolio work"}
                                    className={`h-full w-full object-cover group-hover:brightness-80 transition-all duration-200 ${activeMenu === portfolioItemId ? "brightness-80" : ""}`}
                                />
                            </div>
                            <div>
                                <h4 className=" text-sm text-gray-800">
                                {item.title||"Untitled Project"}
                                </h4>
                            </div>
                            <div ref={menuRef} className="absolute z-50 top-2 right-2">
                                <button
                                    type="button"
                                    aria-label={`Portfolio actions for ${item.title || "Untitled Project"}`}
                                    aria-haspopup="menu"
                                    aria-expanded={activeMenu === portfolioItemId}
                                    onClick={() => togglePortfolioMenu(portfolioItemId, menuRef)}
                                    className={`bg-white size-8 border flex items-center justify-center rounded-full border-orange-400 opacity-0 transition-opacity ${activeMenu === portfolioItemId ? "opacity-100" : ""} group-hover:opacity-100 focus-visible:opacity-100`}
                                >
                                    <Ellipsis size={16} className="text-orange-400" />
                                </button>
                                {activeMenu === portfolioItemId && (
                                <div data-portfolio-menu-panel role="menu" className="absolute right-0 w-20 z-50 mt-2 md:w-52 rounded-xl border border-gray-100 bg-white p-1.5 text-gray-700 shadow-lg shadow-gray-200/60">
                                    <ul className="flex flex-col">
                                        <li>
                                            <button type="button" role="menuitem" onClick={() => handleEditPortfolio(item)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-orange-50 hover:text-[#FF7A00]">
                                                <p className="text-sm">Edit</p>
                                            </button>
                                        </li>

                                        <li>
                                            <button type="button" role="menuitem" onClick={() => handleDeletePortfolio(item)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50">
                                                <p className="text-sm">Delete</p>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            </div>
                            
                        </div>
                        );
                    })}
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
        className="rounded-2xl border border-gray-300/60 bg-white p-6"
    >
        {/* Header */}
        <div className="flex min-w-full items-center justify-between">
            <h3 className="text-2xl text-[#111111]">
                Experience
            </h3>

            <button
                type="button"
                onClick={() => setmodel("experience")}
                className="flex size-7 items-center justify-center rounded-full border border-orange-400"
            >
                <Plus
                    className="text-orange-400 transition-all duration-200 hover:rotate-180 hover:text-orange-600"
                    size={15}
                />
            </button>
        </div>

        {/* Experiences */}
        {technicalData?.experience?.length > 0 ? (
            <div className="mt-6 space-y-5">
                {technicalData?.experience.map((experience, index) => (
                    <div
                        key={experience._id || index}
                        className="border-b border-gray-100 pb-5 last:border-0"
                    >
                        <h4 className="text-base font-semibold text-gray-900">
                            {experience.title}
                        </h4>

                        {experience.description && (
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                {experience.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            /* Empty State */
            <div className="flex min-h-65 flex-col items-center justify-center">
                <div className="size-24">
                    <Image
                        src="/photoMeaning/icons8-file-192.svg"
                        alt="No experience"
                        width={100}
                        height={100}
                        quality={10}
                        className="h-full w-full object-contain"
                    />
                </div>

                <div className="text-gray-800/60">
                    Add any experience to help you grow
                </div>

                <button
                    type="button"
                    onClick={() => setmodel("experience")}
                    className="my-2 border-b border-white text-orange-500/90 transition-colors hover:border-orange-400 hover:text-orange-500"
                >
                    Add Experience
                </button>
            </div>
        )}
    </motion.div>
    {/*window overlay*/}
    <AnimatePresence>
        {model ==="skills" && <Skillsmodel setmodel={setmodel} />}
        {model ==="portfolio" && <Portfoliomodel   setmodel={setmodel} selectedPortfolioItem={selectedPortfolioItem}  setSelectedPortfolioItem={setSelectedPortfolioItem}/>}
        {model ==="Newlanguage" ? <Languagesmodel setmodel={setmodel} newlanguage={true} /> : ""}
        {model ==="Editlanguages" && <Languagesmodel setmodel={setmodel} newlanguage={false} />}
        {(model ==="education") && <ProfileRecordModel type={model} setmodel={setmodel} />}
        {(model ==="experience") && <Experiencemodel  setmodel={setmodel} />}
        {(model ==="DeletePortfolio") && <Deletemodel item={selectedPortfolioItem}  setmodel={setmodel} />}
    </AnimatePresence>
    </div>
);
}
