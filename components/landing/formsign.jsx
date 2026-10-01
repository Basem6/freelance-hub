"use client";
import Link from "next/link";
import { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../app/lib/hooks";
import { setUser } from "../../app/lib/Features/authSlice.js";
import { useSearchParams } from "next/navigation";
import { useShowToast } from "../../app/hooks/showToast.js";
import { UserRound } from "lucide-react";
import { MapPin } from "lucide-react";
import { LockKeyhole } from "lucide-react";
import { Mail } from "lucide-react";
import { Loader } from "lucide-react";
const Formsign = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const dispatch = useAppDispatch()
  const router = useRouter();
  const showToast = useShowToast()
  const [ loading,setLoading] = useState(false);
  const [data, setData] = useState({
      userName: "",
      email: "",
      password: "",
      age: "",
      country:"",
      activeRole:role,
  });
  const handleChange = (e) => {
      const { name, value } = e.target;

      setData((prev) => ({
      ...prev,
      [name]: value,
      }));
  };

  const handleSubmit =  async (e) => {
      e.preventDefault();

      // Validation
      if (!data.userName.trim()) {
      showToast({message:"please entre the name",type:"warning"})
      return;
      }

      if (!data.country.trim()) {
      showToast({message:"please entre the country",type:"warning"})
      return;
      }

      if (!data.email.trim()) {
      showToast({message:"please entre the email",type:"warning"})
      return;
      }

      if (!data.password) {
      showToast({message:"please entre the password",type:"warning"})
      return;
      }

      if (data.password.length < 6) {
      showToast({message:"the password must be at least 6 char",type:"warning"})
      return;
      }
      console.log(data)
      setLoading(true);
      try {
      const res = await fetch('/api/auth/register', {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
          fullName:data.userName,
          age:data.age,
          country:data.country,
          email: data.email,
          password: data.password,
          role:data.activeRole
          }),
      });

      const response = await res.json();
      console.log(response);

      if (res.ok) {
          showToast({message:"Account created successfully",type:"sucess"});
          dispatch(setUser(response.user));
          setTimeout(() => {
          router.push("/");
          }, 200);
      } else {
          showToast({message:response.message||"worng in login",type:"warning"})
      }
      } catch (error) {
      console.error(error);
      showToast({message:"error in connection",type:"error"})
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
      <form className="form md:w-130 w-full mt-10 md:border md:border-gray-600/20 flex flex-col gap-2 bg-[#ffffff]  rounded-sm py-5 px-10" onSubmit={handleSubmit} >
      <h1 className="md:text-2xl text-xl text-center text-[#111111] mb-4">Sign up to find work you love</h1>
        <div className="flex-column">
          <label>Name </label>
        </div>
        <div className="inputForm">
          <UserRound strokeWidth={1} />
          <input type="text" className="input" name="userName" value={data.userName} onChange={handleChange} placeholder="Enter your Name" />
        </div>
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <Mail strokeWidth={1} />
          <input type="email" className="input" onChange={handleChange} name="email" value={data.email} placeholder="Enter your Email" />
        </div>
        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <LockKeyhole strokeWidth={1} />
          <input type="password" className="input" onChange={handleChange} name="password" value={data.password} placeholder="Enter your Password" />
        </div>
        <div className="flex-column">
          <label>Country </label>
        </div>
        <div className="inputForm">
          <MapPin strokeWidth={1} />
          <input type="text" className="input" name="country" value={data.country} onChange={handleChange} placeholder="Enter your Country" />
        </div>
        <button disabled={loading} className={`button-submit ${loading ? 'opacity-50 cursor-no-drop' : 'cursor-pointer opacity-100'}`} type="submit">
          <div className='flex justify-center items-center gap-2'>
          <div>Sign Up</div>
          <div>{loading ? <Loader size={16} className="animate-spin" /> : ""}</div>
          </div>
        </button>
        <div className="flex min-w-full justify-center items-center py-4.5">
        <span className="or text-sm absolute">Or</span>
        </div>
        <div>
        <div className="min-w-full flex justify-center">
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
        </div>
        <p className="p">Already have a account? <Link className="span" href='/login'>login</Link></p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  ::placeholder {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .form button {
    align-self: flex-end;
  }

  .flex-column > label {
    color: #151717;
    font-weight: 450;
  }

  .inputForm {
    border: 1.5px solid #ecedec;
    border-radius: 10px;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    transition: 0.2s ease-in-out;
  }

  .input {
    margin-left: 10px;
    border-radius: 10px;
    border: none;
    width: 85%;
    height: 100%;
  }
  .input:focus {
    outline: none;
  }

  .inputForm:focus-within {
    border: 1.5px solid #333;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
  }

  .flex-row > div > label {
    font-size: 14px;
    color: black;
    font-weight: 400;
  }

  .span {
    font-size: 14px;
    margin-left: 5px;
    color: #2d79f3;
    font-weight: 500;
    cursor: pointer;
  }

  .button-submit {
    margin: 20px 0 10px 0;
    background-color: oklch(75.812% 0.15293 65.883);
    border: none;
    color: white;
    font-size: 15px;
    font-weight: 500;
    border-radius: 10px;
    height: 50px;
    width: 100%;
    cursor: pointer;
  }

  .button-submit:hover {
    background-color: #252727;
  }

  .p {
    text-align: center;
    color: black;
    font-size: 14px;
    margin: 5px 0;
  }

  .btn {
    margin-top: 10px;
    width: 100%;
    height: 50px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    gap: 10px;
    border: 1px solid #ededef;
    background-color: white;
    cursor: pointer;
    transition: 0.2s ease-in-out;
  }

  .btn:hover {
    border: 1px solid #2d79f3;
  }`;

export default Formsign;
