import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import toast from "react-hot-toast";

import {
  Dialog, DialogHeader, DialogContent,DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,SelectItem, SelectTrigger, SelectContent, SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import UserInfo from "@/components/UserInfo";
import MeetingCard from "@/components/MeetingCard";
import { Loader2Icon, XIcon } from "lucide-react";
import { TIME_SLOTS } from "@/constants";
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


const InterviewScheduleUI = () => {
  const client = useStreamVideoClient();
  const {user} = useUser();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const interviews = useQuery(api.interviews.getAllInterviews) ?? [];
  const users = useQuery(api.users.getUsers) ?? [];
  const createInterview = useMutation(api.interviews.createInterview);

  const candidates = users?.filter((u) => u.role === 'candidate');
  const interviewers = users?.filter((u) => u.role === 'interviewer');

  const [formData, setFormData] = useState({
    title : "",
    description : "",
    date : new Date(),
    time: "09.00",
    candidateId : "",
    interviewerIds : user?.id ? [user.id] : [],
  });

  const scheduleMeeting = async () => {
    if (!client || !user) return;
    if(!formData.candidateId || formData.interviewerIds.length === 0){
      toast.error("Please Select both candidate and atleast one interviewer");
      return;
    }

    setCreating(true);

    try{
      const {title, description, date, time, candidateId, interviewerIds} = formData;
      const [hour, minutes] = time.split(":");
      const meetingDate = new Date(date);
      meetingDate.setHours(parseInt(hour), parseInt(minutes),0);

      const id = crypto.randomUUID();
      const call = client.call("default",id);

      await call.getOrCreate(
        {
          data:{
            starts_at: meetingDate.toISOString(),
            custom:{
              description: title,
              additionaldetails:description,
            },
          }
        }
      );

      await createInterview({
        title : title,
        description : description,
        startTime : meetingDate.getTime(),
        status : "upcoming",
        streamCallId : id,
        candidateId : candidateId,
        interviewerIds : interviewerIds,
      })
      
      setOpen(false);
      toast.success("Meeting Scheduled Successfully");

      setFormData({
    title : "",
    description : "",
    date : new Date(),
    time: "09.00",
    candidateId : "",
    interviewerIds : user?.id ? [user.id] : [],        
      });

    }catch(error){
      console.log(error);
      toast.error("Failed to Creating Scheduled Meeting");
    }finally{
      setCreating(false);
    }
  }

  const addInterviewer = (interviewerId : string) => {
    if(!formData.interviewerIds.includes(interviewerId)){
      setFormData((prev) => ({
        ...prev,
        interviewerIds : [...prev.interviewerIds, interviewerId],
      }));
    };
  };

  const removeInterviewer = (interviewerId : string) => {
    if(user?.id === interviewerId) return;
    setFormData((prev) => ({
      ...prev,
      interviewerIds : prev.interviewerIds.filter((i) => i != interviewerId),
    }));

  };

  const selectedInterviewer = interviewers.filter((i) => formData.interviewerIds.includes(i.clerkId));
  const availableInterviewer = interviewers.filter ((i) => !formData.interviewerIds.includes(i.clerkId));

    return (
    <div className="container max-w-7xl p-6 space-y-8">
      <div className = "flex items-center justify-between">
        <div>
          <h1 className = "text-3xl font-bold">Interviews</h1>
          <p className = " text-muted-foreground mt-1"> Schedule and Manage Interviewes</p>
        </div>

        <Dialog open = {open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size = 'lg'>Schedule a Meeting</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] h-[calc(100vh-150px)] overflow-auto">
            <DialogHeader>
              <DialogTitle>Schedule Interview</DialogTitle>
            </DialogHeader>
            <div className = "space-y-4  py-4">

              {/*Title */}

              <div className = "space-y-2">
                <label className = "text-sm font-medium">Title</label>
                <Input
                placeholder = "title"
                value = {formData.title}
                onChange={(e) => setFormData({...formData,title : e.target.value})}
                />
              </div>

              {/*description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                placeholder="Interview Description"
                value = {formData.description}
                onChange={(e) => setFormData({...formData,description: e.target.value})}
                rows = {3}
                />
              </div>
              {/* Candidate */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate</label>
                <Select
                value={formData.candidateId}
                onValueChange={(c) => setFormData({...formData,candidateId : c})}>
                <SelectTrigger>
                  <SelectValue placeholder = "Select a Candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.clerkId} value = {c.clerkId}>
                      <UserInfo user = {c}/>
                    </SelectItem>
                  ))}
                </SelectContent>
                </Select>
              </div>
              {/*Interviewers*/}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Interviewers</label>
                <div className="flex flex-wrap gap-2 mb-2 ">
                  {selectedInterviewer.map((i) => (
                    <div key={i.clerkId} className="inline-flex items-center gap-2 bg-secondary px-2 py-1 rounded-md text-sm" >
                      <UserInfo user = {i}/>
                      {i.clerkId === user?.id && (
                        <button
                        onClick={() => removeInterviewer(i.clerkId)}
                        className="hover:text-destructive transition-colors" >
                          <XIcon size= {4}/>
                        </button>
                      )} 
                    </div>
                  ))}
                </div>
                {availableInterviewer.length > 0 && (
                <Select onValueChange={addInterviewer}>
                  <SelectTrigger>
                    <SelectValue placeholder = "Add Interviewer"/>
                  </SelectTrigger>
                  <SelectContent>
                    {availableInterviewer.map((i) => (
                      <SelectItem key = {i.clerkId} value={i.clerkId}>
                        <UserInfo user = {i}/>
                      </SelectItem>
                    ))}
                  </SelectContent>
                  
                </Select>
                )}

              </div>

              {/* Date && Time*/}

              <div className="flex gap-4">

                <div className="space-y-2">
                <label className="text-sm font-medium"> Date</label>
                <Calendar
                mode = "single"
                selected={formData.date}
                onSelect={(date) => date && setFormData({...formData,date})}
                disabled = {(date) => date < new Date()}
                className=" rounded-md border"
                />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Select
                    value={formData.time}
                    onValueChange={(time) => setFormData({ ...formData, time })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Button */}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick ={() => setOpen(false)}>Cancel</Button>
                <Button onClick={scheduleMeeting} disabled = {creating}>
                {creating ? (
                  <>
                  <Loader2Icon className="mr-2 animate-spin size-4"/>
                  Scheduling...
                  </>
                ) : 
                "Schedule Interview"
                }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/*Loading State && Meeting Cards */}

      {!interviews ? (
        <div className="flex justify-center py-12">
          <Loader2Icon className="size-8 animate-spin text-muted-foreground"/>
        </div>
      ): interviews.length > 0 ? (
        <div className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((i) => (
              <MeetingCard key={i._id} interview={i}/>
            ))}

          </div>

        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">No interviews Scheduled</div>
      )}
    
    </div>
  )
}

export default InterviewScheduleUI

