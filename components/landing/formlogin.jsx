"use client";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch , useAppSelector } from "../../app/lib/hooks";
import { useRouter } from "next/navigation";
import { cn } from "@/app/lib/utils"
import { buttonVariants } from "../../components/ui/button.tsx"
import { setUser } from '../../app/lib/Features/authSlice.js';
import { useShowToast } from '../../app/hooks/showToast.js';
import { User, Loader , LockKeyhole } from 'lucide-react';
import GoogleBtn from '../ui/googlebtn.jsx';
import { handleChange } from '../../app/utils/handleChange.js';
const Formlogin = () => {
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
const router = useRouter();
const dispatch = useAppDispatch()
const showToast = useShowToast()

const [data, setData] = useState({email: "",password: "",});
const [loading, setLoading] = useState(false);

useEffect(() => {
    if (isAuthenticated) {
        router.push('/nx/findwork');
    }
}, [isAuthenticated, router]);


const handleSubmit = async (e) => {
    e.preventDefault();
    const validateForm = () => {
        if (!data.email?.trim()) {
        showToast({ message: "please Enter a Email", type: "warning" });
        return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
        showToast({ message:"Email is wrong", type: "warning" });
        return false;
        }

        if (!data.password?.trim()) {
        showToast({ message: "please Enter a Password", type: "warning" });
        return false;
        }

        if (data.password.length < 6) {
        showToast({ message: "Password is too short", type: "warning" });
        return false;
        }

        return true;
    };

    if (!validateForm()) return;

    setLoading(true);

    try {
        const res = await fetch('/api/auth/login', {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: data.email.trim(),
            password: data.password.trim(),
        }),
        });

        const response = await res.json();
        if (!res.ok) {
        throw new Error(response.message || "error in server");
        }

        if (!response.user) {
        throw new Error("بيانات غير صحيحة من الخادم");
        }
        console.log(response.user)
        // ✅ Save in Redux + localStorage
        dispatch(setUser(response.user));


        showToast({
        message: "successfully logged in",
        type: "sucess",
        });

    } catch (error) {
        console.error("Login error:", error);
        
        showToast({
        message: error.message || "error in server",
        type: "error",
        });
        setLoading(false);
    } finally {
        setLoading(false);
    }
};
return (
    <StyledWrapper>
    <form className="form_container mt-10 md:border md:border-gray-600/20" onSubmit={handleSubmit}>
        <div className="title_container">
        <p className="title">Log in to Hemma</p>
        <span className="text-gray-800 text-xs text-center">Get started with our app, just create an account and enjoy the experience.</span>
        </div>
        <br />
        <div className="input_container">
        <label className="input_label" htmlFor="email_field">Email</label>
        <User  strokeWidth={1.1} className="icon" />
        <input placeholder="email" title="Inpit title" className="input_field focus:ring-1 focus:ring-black/60" value={data.email} name="email" onChange={(e)=>handleChange(e , setData)} type="email" id="email" />
        </div>
        <div className="input_container">
        <label className="input_label" htmlFor="password_field">Password</label>
        <LockKeyhole  strokeWidth={1.1} className="icon" />
        <input placeholder="Password" title="Inpit title" className="input_field focus:ring-1 focus:ring-black/60" value={data.password} name="password" onChange={(e)=>handleChange(e , setData)} type="password" id="password" />
        </div>
        <button disabled={loading} title="Sign In" type="submit" 
        className={cn(
        buttonVariants({ variant: 'default' }),
        'h-10 px-4 flex gap-2 items-center mt-3 text-primary bg-secondary-foreground min-w-full  sm:inline-flex' , loading ? 'opacity-50 cursor-no-drop' : 'opacity-100 cursor-pointer' ,
    )}>
        <span className='flex justify-center items-center gap-2'>
            <div>Log in </div>
            <div>{loading ? <Loader size={16} className="animate-spin" />: ""}</div>
        </span>
        </button>
        <div className="separator">
        <hr className="line" />
        <span className="or text-sm">Or</span>
        <hr className="line" />
        
        </div>
        <div>
        <GoogleBtn></GoogleBtn>
        </div>
        <p className="text-sm font-thin tracking-wide text-gray-600 mt-7 ">Don't have an Hemma account?</p>
        <button  type='button' onClick={(e)=>{e.preventDefault;router.push('choose-role')}} className="border border-orange-500/80  text-orange-400 p-2 rounded-sm min-w-1/2 hover:opacity-50 transition-opacity duration-200">Sign Up</button>
    </form>

    </StyledWrapper>
);
}

const StyledWrapper = styled.div`
.form_container {
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 50px 40px 20px 40px;
    0px 59px 36px rgba(0, 0, 0, 0.05), 0px 26px 26px rgba(0, 0, 0, 0.04),
    0px 7px 15px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.04);
    border-radius: 11px;
    font-family: "Inter", sans-serif;
}

.logo_container {
    box-sizing: border-box;
    width: 80px;
    height: 80px;
    filter: drop-shadow(0px 0.5px 0.5px #EFEFEF) drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    border-radius: 11px;
}

.title_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.title {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 500;
    
}

.subtitle {
    font-size: 0.725rem;
    max-width: 80%;
    text-align: center;
    line-height: 1.1rem;
}

.input_container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.icon {
    width: 20px;
    position: absolute;
    z-index: 99;
    left: 12px;
    bottom: 9px;
}

.input_label {
    font-size: 0.90rem;
   
    font-weight: 450;
}

.input_field {
    width: auto;
    height: 40px;
    padding: 0 0 0 40px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}




.separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
}

.separator .line {
    display: block;
    width: 100%;
    height: 1px;
    border: 0;
}

.note {
    font-size: 0.75rem;
    text-decoration: underline;
}`;

export default Formlogin;
