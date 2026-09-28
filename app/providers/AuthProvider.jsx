"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/app/lib/hooks";

import {
    setUser,
    logout,
    setLoading,
} from "@/app/lib/Features/authSlice";

import {
    setTechnicalData,
    clearTechnicalData,
} from "@/app/lib/Features/technicalData";

import api from "@/app/utils/api";

export default function AuthProvider({ children }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                dispatch(setLoading(true));

                const res = await api.get("/api/auth/me");

                if (res.data.success && res.data.user) {
                    const user = res.data.user;

                    dispatch(setUser(user));

                    dispatch(
                        setTechnicalData({
                            major: user.major || "",
                            specialty: user.specialty || "",
                            skills: user.skills || [],
                            experience: user.experience || [],
                            education: user.education || [],
                            portfolio: user.portfolio || [],
                            certifications: user.certifications || [],
                            languages: user.languages || [],
                            bio: user.bio || "",
                            hourlyRate: user.hourlyRate || 0,
                        })
                    );
                }
            } catch (error) {
                // فقط لو السيرفر أكد إن الـ token غير صالح
                if (error.response?.status === 401) {
                    dispatch(logout());
                    dispatch(clearTechnicalData());
                } else {
                    console.error("Auth check failed:", error);
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        checkAuth();
    }, [dispatch]);

    return children;
}