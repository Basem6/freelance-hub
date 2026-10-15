import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const searchDirectory = createAsyncThunk(
    "search/searchDirectory",
    async ({ type, params }, { rejectWithValue, signal }) => {
        try {
            const response = await api.get(`/api/search/${type}`, { params, signal });
            return {
                type,
                results: response.data[type] || [],
                page: response.data.page || 1,
                limit: response.data.limit || params.limit,
                total: response.data.total || 0,
                totalPages: response.data.totalPages || 0,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Search is temporarily unavailable"
            );
        }
    }
);

const initialState = {
    results: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    status: "idle",
    error: null,
    currentRequestId: null,
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        clearSearchResults(state) {
            state.results = [];
            state.total = 0;
            state.totalPages = 0;
            state.status = "idle";
            state.error = null;
            state.currentRequestId = null;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(searchDirectory.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(searchDirectory.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.results = action.payload.results;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
                state.status = "succeeded";
                state.currentRequestId = null;
            })
            .addCase(searchDirectory.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                if (action.meta.aborted) {
                    state.status = "idle";
                    state.currentRequestId = null;
                    return;
                }
                state.status = "failed";
                state.error = action.payload || action.error.message || "Search failed";
                state.results = [];
                state.currentRequestId = null;
            });
    },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
