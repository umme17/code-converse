import {mutation, query} from "./_generated/server";
import {v} from "convex/values";

export const addComment = mutation({
    args:{
        content: v.string(),
        rating: v.number(),
        interviewId: v.string(),

    },
    handler: async(ctx , args) => {
        const identity = await ctx.auth.getUserIdentity();
        if(!identity) throw new Error ("Unauthorized User" );

        return await ctx.db.insert("comments",{
            ...args,
            interviewerId: identity.subject,
        });
    },
});

export const getComments = query({
    args:{
        interviewId: v.id("interviews"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if(!identity) throw new Error ("Unauthorized User");

        const comments = await ctx.db.query("comments").withIndex("by_interview_id", (q) => q.eq(("interviewId"), args.interviewId)).collect();
        return comments;
    },
});