"use client";
import React from 'react';
import styled from 'styled-components';
import {  useAppSelector } from "../../app/lib/hooks";
const Toast = () => {
    const {isShow , message , type} = useAppSelector((state) => state.show);
    return (
      <div className={`${isShow? "opacity-100": "opacity-0"} pointer-events-none  transition-all duration-300 fixed left-0 top-19 z-50`}>
        <StyledWrapper>
        <div className="card">
            <svg className="wave" fill={`${type=="sucess"?'#04e4003a':type=="warning"?"#ffa30d3a":type=="info"?"#1a21f43f":"#1b21c5"}`} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,256L11.4,240C22.9,224,46,192,69,192C91.4,192,114,224,137,234.7C160,245,183,235,206,213.3C228.6,192,251,160,274,149.3C297.1,139,320,149,343,181.3C365.7,213,389,267,411,282.7C434.3,299,457,277,480,250.7C502.9,224,526,192,549,181.3C571.4,171,594,181,617,208C640,235,663,277,686,256C708.6,235,731,149,754,122.7C777.1,96,800,128,823,165.3C845.7,203,869,245,891,224C914.3,203,937,117,960,112C982.9,107,1006,181,1029,197.3C1051.4,213,1074,171,1097,144C1120,117,1143,107,1166,133.3C1188.6,160,1211,224,1234,218.7C1257.1,213,1280,139,1303,133.3C1325.7,128,1349,192,1371,192C1394.3,192,1417,128,1429,96L1440,64L1440,320L1428.6,320C1417.1,320,1394,320,1371,320C1348.6,320,1326,320,1303,320C1280,320,1257,320,1234,320C1211.4,320,1189,320,1166,320C1142.9,320,1120,320,1097,320C1074.3,320,1051,320,1029,320C1005.7,320,983,320,960,320C937.1,320,914,320,891,320C868.6,320,846,320,823,320C800,320,777,320,754,320C731.4,320,709,320,686,320C662.9,320,640,320,617,320C594.3,320,571,320,549,320C525.7,320,503,320,480,320C457.1,320,434,320,411,320C388.6,320,366,320,343,320C320,320,297,320,274,320C251.4,320,229,320,206,320C182.9,320,160,320,137,320C114.3,320,91,320,69,320C45.7,320,23,320,11,320L0,320Z" fillOpacity={1} />
            </svg>
            <div className={`icon-container ${type=="sucess"?'bg-[#04e4003a]':type=="warning"?"bg-[#ffa30d3a]":type=="info"?"text-[#1a21f43f]":"bg-[#fc0c0c3a]"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" strokeWidth={0} fill="currentColor" stroke="currentColor" className={`icon ${type=="sucess"?'text-[#22e71e81]':type=="warning"?"text-[#f5a420b9]":type=="info"?"text-[#0e1179]":"text-[#fc0c0c7b]"}`}>
                <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
            </svg>
            </div>
            <div className="message-text-container">
            <p className={`message-text  ${type=="sucess"?'text-[#269b24]':type=="warning"?"text-[#f6b03fdb]":type=="info"?"text-[#1b21c5]":"text-[#d10d0d]"}`} >{type} message</p>
            <p className="sub-text">{message}</p>
            </div>
        </div>
        </StyledWrapper>
      </div>
    );
}

const StyledWrapper = styled.div`
  .card {
    width: 330px;
    height: 70px;
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px 15px;
    background-color: #ffffff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 15px;
  }
  .wave {
    position: absolute;
    transform: rotate(90deg);
    left: -31px;
    top: 32px;
    width: 80px;
  }
  .icon-container {
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    margin-left: 8px;
  }
  .icon {
    width: 17px;
    height: 17px;
  }
  .message-text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex-grow: 1;
  }
  .message-text,
  .sub-text {
    margin: 0;
    cursor: default;
  }
  .message-text {
    font-size: 17px;
    font-weight: 700;
  }
  .sub-text {
    font-size: 14px;
    color: #555;
  }`;

export default Toast;
