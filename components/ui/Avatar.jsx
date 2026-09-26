import Image from "next/image";

export default function Avatar({ user, size = 100, className = "" }) {
    const imageUrl = user?.image || "/avatars/avatar-1.png";
    const altText = user?.fullName || "User Avatar";

    return (
        <div className={`relative size-30 rounded-full overflow-hidden shrink-0 ${className}`}>
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
        </div>
    );
}