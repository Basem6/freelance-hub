
import { useEffect } from "react";
import { useSocketContext } from "../../app/providers/SocketProvider";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { MessageCircle } from "lucide-react";

export default function NotificationNav({nav3Ref  , closeNav}){
    
    const router = useRouter()
    const { notifications ,setNotifications} = useSocketContext(); 
    useEffect(()=>{
        if(document.querySelector(".mobile-nav")){
            gsap.to(".mobile-nav",{
                bottom:0,
                duration:0.2
            })
        }
    },[nav3Ref])
    return(
        <>
            <div className={`${window.matchMedia("(max-width: 767px)").matches ? "mobile-nav" : "desktop-nav"} fixed -bottom-1/2  h-70  left-0 z-9999 w-full select-none rounded-t-lg md:border md:border-gray-400/30  bg-white shadow-lg md:absolute md:bottom-auto md:left-auto md:right-0 md:top-34 md:w-55 md:translate-x-full md:rounded-lg`} ref={nav3Ref}
                >
                <ul
                    className={`flex flex-col select-none  items-center min-h-56 ${
                    notifications.length === 0 ? "justify-center" : "justify-start"
                    }`}
                >
                    {notifications.length > 0 ? (
                    <>
                        {notifications.slice(0, 4).map((element, index) => (
                        <li  
                            onClick={()=>{router.push(`/messages?userId=${element.message.sender?._id}`);closeNav(nav3Ref,"notifications")}}
                            key={element._id || index}
                            className={`py-2 hover:bg-gray-100 select-none min-w-full ${index===0 ?"rounded-t-lg":""} justify-start p-3 py-4  flex gap-4 items-center`}
                        >   
                            <span><MessageCircle size={20} strokeWidth={1} /></span>
                            <p className="text-sm text-gray-700">
                            {element.message?.sender?.fullName
                                ? `${element.message.sender.fullName} sent a message`
                                : "You have a new notification"}
                            </p>
                        </li>
                        ))}
                        {notifications.length > 4 && (
                        <li
                            className="text-center py-2 text-sm text-orange-400 cursor-pointer hover:underline"
                            onClick={() => {
                            router.push("/notification")
                            }}
                        >
                            See All Notifications
                        </li>
                        )}
                    </>
                    ) : (
                    <li className="px-4 py-3 text-sm text-gray-500">
                        No notifications
                    </li>
                    )}
                </ul>
            </div>
            <div className="overlay md:hidden z-9998 fixed left-0 top-0 w-full h-screen bg-black/30">
            </div>
        </>
    )
}