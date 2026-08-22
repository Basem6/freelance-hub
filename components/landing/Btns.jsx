"use client";
import { Reveal } from '@/components/landing/reveal'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight} from 'lucide-react'
import { cn } from '../../app/lib/utils'
import { useAppSelector } from '@/app/lib/hooks';
export default function Btns(){
    const user = useAppSelector((state)=>state.auth.user)
    console.log(user)
    return(
        <Reveal delay={240}>
                    <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                    <a
                        href={`${user?.role==='freelancer'?"/findwork":user?.role==='client'?"/projects":"/login"}`}
                        className={cn(
                        buttonVariants({ variant: 'default' }),
                        'group h-12 w-full px-6 border-none hover:border-none text-sm shadow-lg shadow-primary/30 sm:w-auto',
                        )}
                    >
                        {user?.role==='freelancer'?"Find Projects":user?.role==='client'?"Complete Work":"Get started"}
                        <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <a
                        href="/freelancers"
                        className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'h-12 w-full px-6 text-sm sm:w-auto',
                        )}
                    >
                        Hire Talent
                    </a>
                    </div>
        </Reveal>
    )
}