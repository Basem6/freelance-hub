import { createSlice } from "@reduxjs/toolkit";
const initialState = {
major:"",
specialty:"",
skills: [],
experience: [],
education: [],
portfolio:[],
certifications: [],
languages: [],
bio: "",
hourlyRate: 0,
};

const technicalDataSlice = createSlice({
name: "technicalData",

initialState,

reducers: {
    setTechnicalData: (state, action) => {
    return {
        ...state,
        ...action.payload,
    };
    },

    updateTechnicalData: (state, action) => {
    Object.assign(state, action.payload);
    },

    setSkills: (state, action) => {
    state.skills = action.payload;
    },

    addSkill: (state, action) => {
    if (!state.skills.includes(action.payload)) {
        state.skills.push(action.payload);
    }
    },

    removeSkill: (state, action) => {
    state.skills = state.skills.filter(
        (skill) => skill !== action.payload
    );
    },

    clearTechnicalData: () => initialState,
},
});

export const {
setTechnicalData,
updateTechnicalData,
setSkills,
addSkill,
removeSkill,
clearTechnicalData,
} = technicalDataSlice.actions;

export default technicalDataSlice.reducer;