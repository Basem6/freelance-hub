import Image from "next/image";
import Link from "next/link";
import { TrendingUp , CircleUserRound ,  LogOut ,Settings   } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/lib/hooks";
import {logout} from "../../app/lib/Features/authSlice"
import {clearTechnicalData} from "../../app/lib/Features/technicalData"
import api from "../../app/utils/api";
import Theme from "./Theme";
import { useEffect } from "react";
import gsap from "gsap";
export default function ProfileNav({nav1Ref}){
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch()
    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {
                withCredentials: true,
            });
            window.location.replace("/login");
            dispatch(logout());
            dispatch(clearTechnicalData());
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    useEffect(()=>{
        if(document.querySelector(".mobile-nav")){
            gsap.to(".mobile-nav",{
                bottom:0,
                duration:0.3
            })
        }
    },[nav1Ref])
    return(
        <>
        <div className={`${window.matchMedia("(max-width: 767px)").matches ? "mobile-nav" : "desktop-nav"} fixed -bottom-1/3  left-0 z-9999 w-full select-none rounded-t-lg md:border md:border-gray-400/30  bg-white shadow-lg md:absolute md:bottom-auto md:left-auto md:right-0 md:top-14 md:w-70 md:translate-x-full md:rounded-lg`} ref={nav1Ref}>
            <ul className='flex flex-col gap-1 px-2 pt-2 pb-4'>
                    <Link onClick={()=>setActiveMenu("")} href={`/profile`}>
                    <li className='px-2 py-1.5 hover:bg-gray-200/80 cursor-pointer rounded-sm flex gap-3 items-center'>
                        <div className='size-12 rounded-full overflow-hidden'>
                        <Image
                        src={user?.image?user.image:"/avatars/avatar-1.png"}
                        alt="userphoto"
                        width={100}
                                height={100}
                                className="object-cover  object-center"
                            />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold">
                                {user?.fullName}
                                </p>
            
                                <p className="truncate text-xs  text-gray-400  tracking-wide whitespace-nowrap">
                                {user?.role[0].toUpperCase()}{user?.role.slice(1)} Basic
                                </p>
                            </div>
                    </li>
                    </Link>
                    <div className="sperator  border-b border-gray-400/20 py-1"></div>
                    <Link onClick={()=>setActiveMenu("")} href={`${user.role==="freelancer"?"/profile":"/settings"}`}>
                    <li className=' hover:bg-gray-200/80 mt-1 px-2 py-1.5 rounded-sm cursor-pointer flex gap-3 items-center '>
                        <CircleUserRound size={17} strokeWidth={1} />
                        <p className='text-sm '>My Profile</p>
                    </li>
                    </Link>
                    {user.role==="freelancer"&&
                    <Link onClick={()=>setActiveMenu("")} href={"/earnings"}>
                    <li className=' hover:bg-gray-200/80 px-2 py-1.5 rounded-sm cursor-pointer flex gap-3 items-center '>
                        <TrendingUp size={17} strokeWidth={1}/>
                        <p className='text-sm '>Stats and Trend</p>
                    </li>
                    </Link>
                    }
                    <Theme></Theme>
                    <Link onClick={()=>setActiveMenu("")} href={`/settings`}>
                    <li className=' hover:bg-gray-200/80 px-2 py-1.5 rounded-sm  cursor-pointer flex gap-3 items-center'>
                    <Settings size={17} strokeWidth={1} />
                        <p className='text-sm '>Account Settings</p>
                    </li>
                    </Link>
                    <div className="sperator  border-b border-gray-400/20 py-1 "></div>
                    <li className=' hover:bg-gray-200/80 mt-1 cursor-pointer rounded-sm px-2 py-1.5 flex gap-3 items-center' onClick={handleLogout}>
                    <LogOut size={17} strokeWidth={1} />
                    <p className='text-sm '>Log out</p>
                    </li>
            </ul>
        </div>
        <div className="overlay md:hidden z-9998 fixed left-0 top-0 w-full h-screen bg-black/30">
        </div>
        </>
    )
}