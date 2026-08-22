import DashboardSidebar from "../../components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
return (
        <div className="font-sans antialiased relative min-h-screen">
                <DashboardSidebar />
                {children}
        </div>

)
}