import styled from 'styled-components';

const Radio = () => {
return (
    <StyledWrapper>
    <div  className="radio ">
        <input defaultValue={1} name="rating" type="radio" id="rating-1" />
        <label title="1 stars" htmlFor="rating-1">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        </label>
        <input defaultValue={2} name="rating" type="radio" id="rating-2" />
        <label title="2 stars" htmlFor="rating-2">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        </label>
        <input defaultValue={3} name="rating" type="radio" id="rating-3" />
        <label title="3 stars" htmlFor="rating-3">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        </label>
        <input defaultValue={4} name="rating" type="radio" id="rating-4" />
        <label title="4 stars" htmlFor="rating-4">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        </label>
        <input defaultValue={5} name="rating" type="radio" id="rating-5" />
        <label title="5 star" htmlFor="rating-5">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
        </svg>
        </label>
    </div>
    
    </StyledWrapper>
);
}

const StyledWrapper = styled.div`
.radio {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.radio > input {
    position: absolute;
    appearance: none;
}

.radio > label {
    cursor: pointer;
    font-size: 14px;
    position: relative;
    display: inline-block;
    transition: transform 0.3s ease;
}

.radio > label > svg {
    fill: #d1d5dc;
    transition: fill 0.3s ease;
}

.radio > label::before,
.radio > label::after {
    content: "";
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: #ff9e0b;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
    transition:
    transform 0.4s ease,
    opacity 0.4s ease;
    animation: particle-explosion 1s ease-out;
}

.radio > label::before {
    top: -15px;
    left: 50%;
    transform: translateX(-50%) scale(0);
}

.radio > label::after {
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%) scale(0);
}


.radio > input:checked + label > svg {
    fill: #ff9e0b;
    filter: drop-shadow(0 0 15px rgba(255, 158, 11, 0.9));
    animation: pulse 0.8s infinite alternate;
}

.radio > input:checked + label ~ label > svg,
.radio > input:checked + label > svg {
    fill: #ff9e0b; /* Highlight the stars */
}


.radio input:checked ~ label svg {
    fill: #ffa723;
}`;

export default Radio;
