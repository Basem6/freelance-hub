'use client';
import  { useState } from 'react';
import { useAppSelector } from '@/app/lib/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import TechnicalSettings from '../../../components/setting/TechnicalSettings';
import ProfileTab from '../../../components/setting/ProfileTab';

export default function SettingsPage() {
  const user = useAppSelector(state => state.auth.user);
  const [settingsType, setSettingsType] = useState('personal');
  
  return (
    <div className="min-h-screen bg-white flex w-full">
      <main className="flex-1 p-4 sm:p-6 lg:p-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gray-300/60 bg-white/90 p-4  backdrop-blur">
              <button
                type="button"
                onClick={() => setSettingsType('personal')}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all sm:w-auto ${settingsType === 'personal'
                  ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-500/20'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#111111]'}`}
              >
                Personal Settings
              </button>
              {user.role==="freelancer"?
              <button
                type="button"
                onClick={() => setSettingsType('technical')}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-all sm:w-auto ${settingsType === 'technical'
                  ? 'bg-[#FF7A00] text-white shadow-sm shadow-orange-500/20'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-[#111111]'}`}
              >
                Technical Settings
              </button>:""
}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={settingsType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {settingsType === 'personal' ? (
                  <ProfileTab user={user} />
                ) : (
                  <TechnicalSettings />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

