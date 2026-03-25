import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {intervalToDuration, addHours, isBefore, isAfter, isWithinInterval} from "date-fns"
import { Doc } from "@/convex/_generated/dataModel"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Interview = Doc<"interviews">;
type User = Doc<"users">;
type GroupedInterviews = {
  succeeded?: Interview[];
  failed?: Interview[];
  completed?: Interview[];
  upcoming?: Interview[];
};

export const groupInterviews = (interviews: Interview[]): GroupedInterviews => {
  if( !interviews) return {};

  return interviews.reduce((acc:GroupedInterviews, interview) => {

    const date = new Date(interview.startTime);
    const now = new Date();

    if(interview.status === "succeeded"){
      acc.succeeded = [...(acc.succeeded || []), interview];
    }else if (interview.status === "failed"){
      acc.failed = [...(acc.failed || []), interview];
    }else if (isBefore(date,now)){
      acc.completed = [...(acc.completed || []), interview];
    }else if (isAfter(date,now)){
      acc.upcoming = [...(acc.upcoming || []), interview];
    }
    return acc;

  }, {} as GroupedInterviews);
};

export const getCandidateInfo = (users:User[], candidateId:string) => {
  const candidate = users?.find(user => user.clerkId === candidateId);
  return {
    name: candidate?.name || "Unknown Candidate",
    image: candidate?.image || "",
    initials: candidate?.name.split(" ").map((n) => n[0]).join("") || "UC"
  };
};

export const getInterviewerInfo = (users: User[], interviewerId: string) => {
  const interviewer = users?.find((user) => user.clerkId === interviewerId);
  return {
    name: interviewer?.name || "Unknown Interviewer",
    image: interviewer?.image,
    initials:
      interviewer?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("") || "UI",
  };
};
export const calculateRecordingDuration = (startTime: string, endTime: string) => {

  const start = new Date(startTime);
  const end = new Date(endTime);

  const duration = intervalToDuration({start, end});

  if(duration.hours && duration.hours > 0) {
    return `${duration.hours}:${String(duration.minutes).padStart(2,"0")}:${String(duration.seconds).padStart(2,"0")}`;
  }

  if(duration.minutes && duration.minutes > 0){
    return `${duration.minutes}:${String(duration.seconds).padStart(2,"0")}`;
  }

  return `${duration.seconds} seconds`;

}

export const getMeetingStatus = (interview: Interview) => {
  const now = new Date();
  const start = new  Date(interview.startTime);
  const end = addHours(start, 1); // Assuming interviews are 1 hour long

  if(interview.status === "succeeded" ||
    interview.status === "failed" ||
    interview.status === "completed"){
      return "completed";
    }
  if(isWithinInterval(now, {start, end})){
    return "live";
  }
  if(isBefore(now, start)){
    return "upcoming";
  }
  return "completed";
};
