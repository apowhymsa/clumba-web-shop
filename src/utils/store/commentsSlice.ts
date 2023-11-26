import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "@/types";

export type Comment = {
    commentText: string;
    dateInMs: number;
    productId: string;
    publishingDate: string;
    rating: number;
    userName: string;
    userPhoto: string;
};

type CommentsState = {
    comments: Comment[];
};

const initialState: CommentsState = {
    comments: [],
};

export const commentsSlice = createSlice({
    name: "comments",
    initialState,
    reducers: {
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        addComment: (state, action: PayloadAction<Comment>) => {
            state.comments.push(action.payload);
        }
    },
});

export const { setComments, addComment } = commentsSlice.actions;
export default commentsSlice.reducer;
