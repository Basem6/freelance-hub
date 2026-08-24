import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
return (
        <div className="font-sans antialiased relative min-h-screen">
                <DashboardSidebar />
                <div className="pt-20 md:pt-0">
                        {children}
                </div>
        </div>

)
}