"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Users, Check, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '../../lib/hooks'
import { setUser } from '../../lib/Features/authSlice'
const roles = [
{
    id: 'client',
    title: 'Client',
    description: 'Hire freelancers, post projects, and find the right talent for every brief.',
    icon: Briefcase,
    features: ['Hire freelancers', 'Post projects', 'Find the right talent'],
},
{
    id: 'freelancer',
    title: 'Freelancer',
    description: 'Find projects, submit proposals, and work directly with clients you align with.',
    icon: Users,
    features: ['Find projects', 'Submit proposals', 'Work with clients'],
},
]

export default function ChooseRolePage() {
const [loading, setLoading] = useState(false);
const [googleData, setGoogleData] = useState(null);
const [error, setError] = useState('');
const dispatch = useAppDispatch();
const [selectedRole, setSelectedRole] = useState('')
const router = useRouter()
const [roleData, setRoleData] = useState(null);
const [flowType, setFlowType] = useState(null);

// 🔹 جلب البيانات عند دخول الصفحة
useEffect(() => {
    // Check for Google data
    const googleData = sessionStorage.getItem('googleData');
    if (googleData) {
        console.log('🔐 Google OAuth flow detected');
        setRoleData(JSON.parse(googleData));
        setFlowType('google');
        return;
    }else{
        setFlowType('register');
    }
}, [router]);

// 🔹 دالة عند اختيار الدور
const handleRoleSelect = async (role) => {
    if ( !flowType) return;
    if (flowType === 'google') {
    setLoading(true);
    setError('');   
    try {
        let endpoint, body;
            console.log(`🔄 Creating Google account with role: ${role}`);
            endpoint = '/api/auth/google/complete';
            body = {
                fullName: roleData.fullName,
                email: roleData.email,
                image: roleData.image,
                googleId: roleData.googleId,
                role: role,
            };
        // 📤 استدعاء API
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'حدث خطأ');
        }
        console.log('✅ Account created:', data.user);
        // 🔹 تنظيف البيانات المؤقتة
        sessionStorage.removeItem('googleData');
        // 🔹 حفظ المستخدم في Redux
        dispatch(setUser(data.user));
        // 🔹 Hard redirect → forces browser to commit the Set-Cookie header
        //    before the next page load reads the authToken cookie.
        window.location.replace('/');
    } catch (error) {
        console.error('❌ Error:', error);
        setError(error.message);
    } finally {
        setLoading(false);
    }
    }else{
        router.push(`/sign?role=${selectedRole}`);
    }
};
return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Account type
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Choose how you want to use FreelanceHub
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Pick the role that matches your goals and continue to the account setup.
        </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
            <button
                key={role.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedRole(role.id)}
                className={`group flex min-h-65 w-full flex-col rounded-[1.5rem] border p-6 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isSelected
                    ? 'border-primary bg-primary/5 shadow-[0_18px_40px_rgba(255,122,0,0.12)]'
                    : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50'
                }`}
            >
                <div className="flex items-start justify-between gap-4">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                </span>
                <span
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border text-sm font-semibold transition ${
                    isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-muted-foreground'
                    }`}
                >
                    <Check className="size-4" />
                </span>
                </div>

                <div className="mt-6 flex-1">
                <h2 className="text-xl font-semibold text-foreground">{role.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{role.description}</p>
                </div>

                <div className="mt-6 space-y-3">
                {role.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="size-4" />
                    </span>
                    <span>{feature}</span>
                    </div>
                ))}
                </div>
            </button>
            )
        })}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 rounded-[1.5rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
            <p className="text-sm text-muted-foreground">
            Select your role to continue. This will personalize the registration flow.
            </p>
        </div>

        <Button
            onClick={()=>handleRoleSelect(selectedRole)}
            disabled={!selectedRole}
            className="w-full max-w-xs justify-center sm:w-auto cursor-pointer"
        >
            Continue
        </Button>
        </div>
    </div>
    </main>
)
}
