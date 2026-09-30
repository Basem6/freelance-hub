import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
return (
        <div className="font-sans   antialiased relative min-h-screen flex">
                <div className="" ><DashboardSidebar /></div>
                <div className="flex justify-center parent w-full md:mt-0 mt-17">
                        {children}
                </div>
        </div>

)
}