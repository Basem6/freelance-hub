"use client";
import Link from "next/link";
import { useState } from 'react';
import { cn } from "@/app/lib/utils"
import { buttonVariants } from "../../components/ui/button.tsx"
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../app/lib/hooks";
import { setUser } from "../../app/lib/Features/authSlice.js";
import { useSearchParams } from "next/navigation";
import { useShowToast } from "../../app/hooks/showToast.js";
import OptionSelect from '@/components/ui/OptionSelect';
import { countryOptions } from '@/app/lib/constants/countryOptions';
import { Mail ,Loader ,LockKeyhole , UserRound } from "lucide-react";
import GoogleBtn from "../ui/googlebtn.jsx";
import { handleChange } from "../../app/utils/handleChange.js";
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
      country:"",
      activeRole:role,
  });
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
  return (
    <StyledWrapper>
      <form className="form md:w-130 w-full mt-10 md:border md:border-gray-600/20 flex flex-col gap-2 bg-[#ffffff]  rounded-sm py-5 px-10" onSubmit={handleSubmit} >
      <h1 className="md:text-2xl text-xl text-center text-[#111111] mb-4">Sign up to find work you love</h1>
        <div className="flex-column">
          <label>Name </label>
        </div>
        <div className="inputForm">
          <UserRound strokeWidth={1} />
          <input type="text" className="input" name="userName" value={data.userName} onChange={(e)=>handleChange(e , setData)} placeholder="Enter your Name" />
        </div>
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <Mail strokeWidth={1} />
          <input type="email" className="input" onChange={(e)=>handleChange(e , setData)} name="email" value={data.email} placeholder="Enter your Email" />
        </div>
        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <LockKeyhole strokeWidth={1} />
          <input type="password" className="input" onChange={(e)=>handleChange(e , setData)} name="password" value={data.password} placeholder="Enter your Password" />
        </div>
          <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Country</label>
              <OptionSelect
              value={data.country}
              options={countryOptions}
              placeholder="Select a country"
              onChange={(country) => setData((prev) => ({ ...prev, country }))}
              isSearch={true}
              />
          </div>
        <button disabled={loading} 
            className={cn(
                buttonVariants({ variant: 'default' }),
                'h-10 px-4 flex gap-2 items-center text-primary hover:bg-black/70 mt-3 bg-secondary-foreground min-w-full  sm:inline-flex' , loading ? 'opacity-50 cursor-no-drop' : 'opacity-100 cursor-pointer' ,
          )}>
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
        <GoogleBtn></GoogleBtn>
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
