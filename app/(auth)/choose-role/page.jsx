'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { BriefcaseBusiness, Check, LaptopMinimal } from 'lucide-react'
import { useShowToast } from '../../hooks/showToast'
import { useAppDispatch } from '../../lib/hooks'
import { setUser } from '../../lib/Features/authSlice'

const roles = [
    {
        id: 'client',
        title: "I'm here to hire",
        description: 'Find skilled professionals and hire them to bring your projects to life.',
        icon: BriefcaseBusiness,
    },
    {
        id: 'freelancer',
        title: "I'm here to work",
        description: 'Showcase your skills, find projects, and build your freelance career.',
        icon: LaptopMinimal,
    },
]

export default function ChooseRolePage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [roleData, setRoleData] = useState(null)
    const [flowType, setFlowType] = useState(null)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const showToast = useShowToast()
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

    const handleContinue = async () => {
        if (!selectedRole) {
            showToast({
                message: 'Choose how you want to use Hemma to continue.',
                type: 'warning',
            })
            return
        }

        if (!flowType) return

        if (flowType === 'register') {
            router.push(`/sign?role=${encodeURIComponent(selectedRole)}`)
            return
        }

        if (!roleData) {
            setError('Your Google sign-up session has expired. Please try again.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/auth/google/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: roleData.fullName,
                    email: roleData.email,
                    image: roleData.image,
                    googleId: roleData.googleId,
                    role: selectedRole,
                }),
                credentials: 'include',
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Unable to complete sign-up.')
            }

            sessionStorage.removeItem('googleData')
            dispatch(setUser(data.user))
            window.location.replace('/')
        } catch (requestError) {
            setError(requestError.message || 'Unable to complete sign-up.')
        } finally {
            setLoading(false)
        }
    }

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

                    <div role="group" aria-label="Choose your Hemma role" className="mt-9 grid grid-cols-1 gap-4 sm:mt-11 sm:grid-cols-2 sm:gap-5">
                        {roles.map((role, index) => {
                            const Icon = role.icon
                            const isSelected = selectedRole === role.id

                            return (
                                <motion.button
                                    key={role.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => {
                                        setSelectedRole(role.id)
                                        setError('')
                                    }}
                                    initial={reduceMotion ? false : { opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0, scale: isSelected ? 1.01 : 1 }}
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.28,
                                        delay: reduceMotion ? 0 : index * 0.08,
                                    }}
                                    whileHover={reduceMotion ? undefined : { y: -3 }}
                                    whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                                    className={`relative flex min-h-[220px] w-full flex-col rounded-xl border p-6 text-start transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 sm:min-h-[236px] sm:p-7 ${
                                        isSelected
                                            ? 'border-[#FF7A00] bg-[#FF7A00]/[0.035] shadow-[0_8px_24px_rgba(255,122,0,0.08)]'
                                            : 'border-gray-200 bg-white shadow-[0_2px_8px_rgba(17,17,17,0.035)] hover:border-[#FF7A00]/60 hover:shadow-[0_8px_22px_rgba(17,17,17,0.07)]'
                                    }`}
                                >
                                    <span className={`inline-flex size-11 items-center justify-center rounded-lg transition-colors ${isSelected ? 'bg-[#FF7A00]/10 text-[#FF7A00]' : 'bg-gray-50 text-gray-700'}`}>
                                        <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                                    </span>

                                    {isSelected && (
                                        <span className="absolute end-5 top-5 inline-flex size-7 items-center justify-center rounded-full border border-[#FF7A00] bg-white text-[#FF7A00]" aria-hidden="true">
                                            <Check size={15} strokeWidth={2.4} />
                                        </span>
                                    )}

                                    <span className="mt-6 text-xl font-semibold text-[#171717]" dir="auto">
                                        {role.title}
                                    </span>
                                    <span className="mt-2 max-w-[340px] text-sm leading-6 text-gray-500" dir="auto">
                                        {role.description}
                                    </span>
                                </motion.button>
                            )
                        })}
                    </div>

                    {error && (
                        <p className="mt-5 text-center text-sm text-red-700" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="mt-8 flex justify-center sm:mt-9">
                        <motion.button
                            type="button"
                            onClick={handleContinue}
                            disabled={!selectedRole || !flowType || loading}
                            whileHover={reduceMotion || !selectedRole || loading ? undefined : { scale: 1.02 }}
                            whileTap={reduceMotion || !selectedRole || loading ? undefined : { scale: 0.98 }}
                            aria-busy={loading}
                            className={`h-12 w-full rounded-lg px-10 text-base font-semibold transition-[background-color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[210px] ${
                                selectedRole && flowType && !loading
                                    ? 'bg-[#FF7A00] text-white shadow-sm hover:shadow-[0_6px_18px_rgba(255,122,0,0.22)]'
                                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                            }`}
                        >
                            {loading ? 'Creating your account…' : 'Continue'}
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
