import { motion } from 'framer-motion';

const MOCK_PROJECTS = [
    { id: 1, name: 'E-commerce Website Redesign', client: 'TechCorp', budget: '$4,500', status: 'Active', date: 'Oct 24, 2026' },
    { id: 2, name: 'Mobile App UI/UX', client: 'StartupXYZ', budget: '$2,800', status: 'Pending', date: 'Oct 28, 2026' },
    { id: 3, name: 'Brand Identity', client: 'CreativeStudio', budget: '$1,200', status: 'Completed', date: 'Sep 15, 2026' },
    { id: 4, name: 'Marketing Dashboard', client: 'FinTech Inc', budget: '$3,500', status: 'Active', date: 'Nov 02, 2026' },
    { id: 5, name: 'SEO Optimization', client: 'LocalBiz', budget: '$800', status: 'On Hold', date: 'Oct 30, 2026' },
];

export default function RecentProjects({ loading }) {
    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Active': return 'bg-green-50 text-green-600 border-green-200';
            case 'Pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
            case 'Completed': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'On Hold': return 'bg-gray-50 text-gray-600 border-gray-200';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Recent Projects</h2>
                <button className="text-sm font-medium text-[#FF7A00] hover:text-orange-600 transition-colors">View All</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 font-medium">Project Name</th>
                            <th className="pb-3 font-medium">Client</th>
                            <th className="pb-3 font-medium">Budget</th>
                            <th className="pb-3 font-medium">Status</th>
                            <th className="pb-3 font-medium">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_PROJECTS.map((project, i) => (
                            <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                <td className="py-4">
                                    <span className="font-medium text-gray-900 group-hover:text-[#FF7A00] transition-colors">{project.name}</span>
                                </td>
                                <td className="py-4 text-gray-500 text-sm">{project.client}</td>
                                <td className="py-4 font-medium text-gray-900 text-sm">{project.budget}</td>
                                <td className="py-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(project.status)}`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="py-4 text-gray-500 text-sm">{project.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
