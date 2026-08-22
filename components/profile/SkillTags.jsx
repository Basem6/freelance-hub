'use client';
import { motion } from 'framer-motion';


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function SkillTags({skillsData}) {
  if(!skillsData){
    let  skillsData = [
      "react",
      "fwe"
    ];

  }
  return (
    <div className="bg-white rounded-2xl relative shadow-sm p-8 py-8 mb-6 min-h-66 max-h-66 overflow-hidden ">
      {skillsData.length<=0?
      <div className="flex justify-center absolute top-0 left-0  min-w-full    items-center text-4xl text-gray-700 min-h-full"> No skills yet</div>:
      ""
      }
      <h2 className="text-xl font-bold text-gray-900 mb-6">Skills</h2>
      <div className="min-h-full">
        {skillsData.length>0 ?
        <div className='flex gap-3 flex-wrap '>
        {skillsData&&skillsData.map((skill, sIdx) => (
                <motion.div
                  key={sIdx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border cursor-default transition-all bg-blue-100 text-blue-800 border-blue-200`}
                >
                  <span>{skill}</span>
                </motion.div>
        ))}
        </div>:
       ""
        }
      </div>
    </div>
  );
}
