"use client";
import Link from "next/link";
import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { useAppDispatch , useAppSelector } from "../../app/lib/hooks";
import  {setShow , hideShow} from "../../app/lib/Features/showSlice.js";
import { type } from "os";
import { setUser } from "../../app/lib/Features/authSlice.js";
import { useSearchParams } from "next/navigation";
const Formsign = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const dispatch = useAppDispatch()
  function showToast(message){
  dispatch(setShow(message))
  setTimeout(() => {
      dispatch(hideShow())
  }, 3000);
  } 
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
      userName: "",
      email: "",
      password: "",
      age: "",
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

      if (!data.age) {
      showToast({message:"please entre the age",type:"warning"})
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
      const res = await fetch("https://hemma-production-fbbd.up.railway.app/api/auth/register", {
          method: "POST",
          headers: {
          'Content-Type': 'application/json',
          },
          credentials: "include",
          body: JSON.stringify({
          fullName:data.userName,
          age:data.age,
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
          console.log(response.token)
          setTimeout(() => {
          router.push("/");
          }, 200);
      } else {
          showToast({message:response.message||"worng in login",type:"warning"})
      }
      } catch (error) {
      console.error(error);
      showToast({message:"error in connection",type:"error"})
      } finally {
      setLoading(false);
      }
  };
  const handleGoogleLogin = () => {
    window.location.href = 
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=206275470398-ks60mr8ume6jqmeckebfl7q36elrq9g2.apps.googleusercontent.com&` +
    `redirect_uri=http://localhost:3000&` +
    `response_type=code&` +
    `scope=openid email profile`;
};
  return (
    <StyledWrapper>
      <form className="form md:w-[600px] w-full flex flex-col gap-2 bg-[#ffffff] mt-7.5 md:shadow-xl rounded-3xl py-5 px-13" onSubmit={handleSubmit} >
        <div className="flex-column">
          <label>Name </label>
        </div>
        <div className="inputForm">
          <svg height={60} viewBox="0 -9 32 32" width={40} xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
            </g>
          </svg>
          <input type="text" className="input" name="userName" value={data.userName} onChange={handleChange} placeholder="Enter your Name" />
        </div>
        <div className="flex-column">
          <label>Age </label>
        </div>
        <div className="inputForm">
          <svg height={60} viewBox="0 -9 32 32" width={40} xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
            </g>
          </svg>
          <input type="number" className="input" name="age" value={data.age} onChange={handleChange} placeholder="Enter your Age" />
        </div>
        <div className="flex-column">
          <label>Email </label>
        </div>
        <div className="inputForm">
          <svg height={20} viewBox="0 0 32 32" width={20} xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" />
            </g>
          </svg>
          <input type="email" className="input" onChange={handleChange} name="email" value={data.email} placeholder="Enter your Email" />
        </div>
        <div className="flex-column">
          <label>Password </label>
        </div>
        <div className="inputForm">
          <svg height={20} viewBox="-64 0 512 512" width={20} xmlns="http://www.w3.org/2000/svg">
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
          </svg>
          <input type="password" className="input" onChange={handleChange} name="password" value={data.password} placeholder="Enter your Password" />
        </div>
        <button className="button-submit">Sign Up</button>
        <p className="p">Already have a account? <Link className="span" href='/login'>login</Link></p>
        {/* <div className="flex-row">
          <button class="button-google" type="button" onClick={handleGoogleLogin}>
                      <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
                      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
                      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
                      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
                      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
                      </svg>
                  Continue with Google
          </button>
        </div> */}
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
    font-weight: 600;
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
    border: 1.5px solid #2d79f3;
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
