import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
return (
        <div className="font-sans gap-5 antialiased relative min-h-screen flex">
                <div className=""><DashboardSidebar /></div>
                <div className="flex justify-center w-full">
                        {children}
                </div>
        </div>

)
}