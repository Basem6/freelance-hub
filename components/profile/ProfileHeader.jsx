'use client';
import { motion } from 'framer-motion';
import { MapPin, Star, BadgeCheck, Heart, Circle, CheckCircle } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-b-2xl shadow-sm overflow-hidden mb-6"
    >
      {/* Cover Image */}
      <div className="relative w-full h-[120px] bg-gradient-to-r from-white via-white to-white">
        <div className="absolute top-4 right-4 flex space-x-2">
          {/* Optional actions inside cover */}
        </div>
      </div>

      {/* Profile Info Container */}
      <div className="relative px-6 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          
          {/* Left side: Avatar + Info */}
          <div className="flex flex-col md:flex-row md:items-end flex-1">
            {/* Avatar - overlaps cover */}
            <div className="relative -mt-16 z-10 w-32 h-32 md:mr-6 mb-4 md:mb-0">
              <div className="w-full h-full rounded-full border-4 border-white bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-md">
                {/* Simulated image using an abstract pattern or text for now, assuming placeholder image usually */}
                <div className="w-full h-full bg-gradient-to-tr from-[#FF7A00]/40 to-purple-400 flex items-center justify-center text-4xl text-white font-bold">
                  AC
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Available"></div>
            </div>

            {/* Basic Info */}
            <div className="flex flex-col pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-gray-900">{name ||"Alexandra Chen"}</h1>
                <BadgeCheck className="w-6 h-6 text-blue-500" />
                <span className="bg-[#FF7A00] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Top Rated Plus</span>
              </div>
              <h2 className="text-lg text-gray-600 font-medium mb-2">{major||"Senior UI/UX Designer & Frontend Developer"}</h2>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {country ||"San Francisco, CA"}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FF7A00] text-[#FF7A00]" /> 
                  <span className="font-semibold text-gray-900">{rate || "3.4"}</span> 
                  <span>({reviews || "247 reviews"})</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Available
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Action Buttons */}
          <div className="flex items-center gap-3 mt-6 md:mt-0 pb-2">
            <button className="p-3 text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg hover:border-red-200 transition-colors bg-white shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Message
            </button>
            <button className="px-8 py-3 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-lg transition-colors shadow-md">
              Hire Me
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-y-4 justify-between md:justify-start md:gap-12">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">$127K+</span>
            <span className="text-sm text-gray-500 font-medium">Earned</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">98%</span>
            <span className="text-sm text-gray-500 font-medium">Job Success</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">127</span>
            <span className="text-sm text-gray-500 font-medium">Jobs Completed</span>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">2h</span>
            <span className="text-sm text-gray-500 font-medium">Response Time</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
