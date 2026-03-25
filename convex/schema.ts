import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image:v.optional(v.string()),
        role:v.union(v.literal("interviewer"),v.literal("candidate")),
        clerkId:v.string(),
    }).index("by_clerk_id", ["clerkId"]),

    interviews: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        endTime: v.optional(v.number()),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
        status: v.string(),
        streamCallId: v.string(),
    }).index("by_candidate_id",["candidateId"]).index("by_streamCallId",["streamCallId"]),

    comments: defineTable({
        content: v.string(),
        rating: v.number(),
        interviewId: v.string(),
        interviewerId: v.string(),

    }).index("by_interview_id",["interviewId"]),
    
})