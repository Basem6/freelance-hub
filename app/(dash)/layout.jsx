import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
return (
        <div className="font-sans bg-white md:bg-gray-100   antialiased relative min-h-screen  max-h-screen overflow-hidden flex">
                <div className="" ><DashboardSidebar /></div>
                <div className="flex bg-white  pb-4     max-h-screen overflow-auto justify-center rounded-2xl mr-0.5  parent w-full md:mb-1.5 md:mt-4 mt-17">
                        {children}
                </div>
        </div>

)
}