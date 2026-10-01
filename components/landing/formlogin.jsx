"use client";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAppDispatch , useAppSelector } from "../../app/lib/hooks";
import  {setShow , hideShow} from "../../app/lib/Features/showSlice.js";
import { useRouter } from "next/navigation";
import { setUser } from '../../app/lib/Features/authSlice.js';
import { useShowToast } from '../../app/hooks/showToast.js';
import { LockKeyhole } from 'lucide-react';
import { User } from 'lucide-react';
import { Loader } from 'lucide-react';
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

const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
    ...prev,
    [name]: value,
    }));
};

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
        console.error("❌ Login error:", error);
        
        showToast({
        message: error.message || "error in server",
        type: "error",
        });
        setLoading(false);
    } finally {
        setLoading(false);
    }
};
const handleGoogleLogin = () => {
    window.location.href =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=206275470398-ks60mr8ume6jqmeckebfl7q36elrq9g2.apps.googleusercontent.com&` +
    `redirect_uri=${encodeURIComponent(`${window.location.origin}/callback`)}&` +
    `response_type=code&` +
    `scope=openid email profile`;
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
        <input placeholder="email" title="Inpit title" className="input_field focus:ring-1 focus:ring-black/60" value={data.email} name="email" onChange={handleChange} type="email" id="email" />
        </div>
        <div className="input_container">
        <label className="input_label" htmlFor="password_field">Password</label>
        <LockKeyhole  strokeWidth={1.1} className="icon" />
        <input placeholder="Password" title="Inpit title" className="input_field focus:ring-1 focus:ring-black/60" value={data.password} name="password" onChange={handleChange} type="password" id="password" />
        </div>
        <button disabled={loading} title="Sign In" type="submit" className={`sign-in_btn ${loading ? 'opacity-50 cursor-no-drop' : 'opacity-100 cursor-pointer'}`}>
        <span className='flex justify-center items-center gap-2'>
            <div>Sign In </div>
            <div>{loading ? <Loader size={16} className="animate-spin" />: ""}</div>
        </span>
        </button>
        <div className="separator">
        <hr className="line" />
        <span className="or text-sm">Or</span>
        <hr className="line" />
        
        </div>
        <div>
        <button className="button-google" type="button" onClick={handleGoogleLogin}>
            <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
            <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
            <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
            <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
            <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
            </svg>
        Continue with Google
        </button>
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

.input_field:focus {
}

.sign-in_btn {
    width: 100%;
    height: 40px;
    border: 0;
    background: oklch(75.812% 0.15293 65.883);
    border-radius: 7px;
    outline: none;
    color: #ffffff;
    
}

.sign-in_ggl {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: white;
    border-radius: 7px;
    outline: none;
    color: black;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    cursor: pointer;
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
