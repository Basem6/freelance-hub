'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { BriefcaseBusiness, Check, LaptopMinimal ,ArrowRight} from 'lucide-react'
import { useShowToast } from '../../hooks/showToast'
import { useAppDispatch } from '../../lib/hooks'
import { setUser } from '../../lib/Features/authSlice'

const roles = [
    {
        id: 'client',
        title: "Client",
        description: 'Posts jops and hire',
        icon: BriefcaseBusiness,
    },
    {
        id: 'freelancer',
        title: "Freelancer",
        description: 'Work and get paid',
        icon: LaptopMinimal,
    },
]

export default function ChooseRolePage() {
    const [roleData, setRoleData] = useState(null)
    const [flowType, setFlowType] = useState(null)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const storedGoogleData = sessionStorage.getItem('googleData')

        if (!storedGoogleData) {
            setFlowType('register')
            return
        }

        try {
            setRoleData(JSON.parse(storedGoogleData))
            setFlowType('google')
        } catch {
            sessionStorage.removeItem('googleData')
            setFlowType('register')
        }
    }, [])

    return (
        <div className="flex min-h-screen pt-10 flex-col bg-gradient-to-b from-orange-50 via-white to-gray-100 text-[#171717]">
        

            <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: 'easeOut' }}
                    className="w-full max-w-[900px]"
                >
                    <div className="mx-auto max-w-[620px] text-center">
                        <p className="text-sm font-semibold text-[#FF7A00]">GETTING STARTED</p>
                        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl" dir="auto">
                            How do you want to use Hemma?
                        </h1>
                        <p className="mx-auto mt-4 max-w-[500px] text-base leading-7 text-gray-500" dir="auto">
                            Choose the experience that best matches what you want to do.
                        </p>
                    </div>

                    <div role="group" aria-label="Choose your Hemma role" className="flex gap-9 justify-center flex-nowrap mt-8 sm:mt-10">
                        {roles.map((role, index) => {
                            const Icon = role.icon
                            return (
                                <motion.button
                                    key={role.id}
                                    type="button"
                                    aria-pressed={role.id}
                                    onClick={() => {
                                        router.push(`/sign?role=${encodeURIComponent(role.id)}`)
                                    }}
                                    initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0, scale: role.id ? 1.01 : 1 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.28,
                                        delay: reduceMotion ? 0 : index * 0.08,
                                    }}
                                    
                                    whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                                    className={`relative  flex group w-fit flex-col rounded-sm border p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 `}
                                >
                                    <span className={`inline-flex  opacity-80 hover:opacity-100 transition-opacity duration-200  size-50  bg-gradient-to-br from-orange-50/20 from-[0%] via-orange-300/90 via-[45%] to-orange-50/30 to-[100%] items-center justify-center rounded-lg transition-colors`}>
                                        <Icon size={41} strokeWidth={1.4} aria-hidden="true" />
                                    </span>

                                    <span className="mt-6 text-xl justify-center text-[#171717] flex gap-3 items-center" dir="auto">
                                        <span>{role.title}</span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-200"><ArrowRight size={20} strokeWidth={1.5} /></span>
                                    </span>
                                    <span className="mt-2 text-center max-w-[340px] text-sm leading-6 text-gray-500" dir="auto">
                                        {role.description}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
