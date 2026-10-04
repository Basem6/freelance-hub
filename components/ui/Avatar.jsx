import Image from "next/image";

export default function Avatar({ user, size = 100, className = ""  , online=false}) {
    const imageUrl = user?.image || "/avatars/avatar-1.png";
    const altText = user?.fullName || "User Avatar";

    return (
        <div className={`relative w-full h-full rounded-full  shrink-0 ${className}`}>
            <Image
                src={imageUrl}
                alt={altText}
                width={size}
                height={size}
                className="rounded-full object-cover bg-white w-full h-full"
                priority={false}
                onError={(e) => {
                    e.currentTarget.src = "/avatars/avatar-1.png";
                }}
            />
            {online && <div className='absolute left-1 top-1 size-3 rounded-full bg-green-600 outline-4 outline-white'></div>}
        </div>
    );
}