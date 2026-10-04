export default function Loadingbtn(){
    return(
        <div className="flex flex-row gap-2 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-bounce [animation-delay:.7s]"></div>
            <div className="w-1.5 h-1.5 rounded-full  bg-orange-300 animate-bounce [animation-delay:.3s]"></div>
            <div className="w-1.5 h-1.5 rounded-full  bg-orange-300 animate-bounce [animation-delay:.7s]"></div>
        </div>
    )
}