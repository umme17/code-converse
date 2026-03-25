"use client";
import { useQuery,useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc,Id } from '@/convex/_generated/dataModel';
import LoaderUI from '@/components/LoaderUI';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { INTERVIEW_CATEGORY } from '@/constants';
import { groupInterviews, getCandidateInfo } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from 'lucide-react';
import { format } from 'date-fns';
import CommentDialog from '@/components/CommentDialog';

type interviews = Doc <'interviews'>;

function DashboardPage() {
  const users = useQuery(api.users.getUsers);
  const interviews = useQuery(api.interviews.getAllInterviews);
  const updateStatus = useMutation(api.interviews.updateInterviewStatus);

  const handleStatusUpdate = async (interview_id : Id<'interviews'>, status : string) => {
    try{
      await updateStatus({id:interview_id, status});
      toast.success("Status updated successfully");
    }catch(error){
      console.log(error);
      toast.error("error found while updating status");
    }
  }

  if(!interviews || !users) return <LoaderUI/>

  const groupedInterview = groupInterviews(interviews);

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-8">
        <Link href="/schedule">
          <Button>Scheudle a Meeting</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {INTERVIEW_CATEGORY.map(
          
          (c) =>  {
             const interviewsList = groupedInterview[c.id];

        if (!interviewsList || interviewsList.length === 0) return null;
          
          return(
          <section key = {c.id}>

            <div className='flex items-center gap-2 mb-4'>
              <h1 className='text-xl font-semibold'>{c.title}</h1>
              <Badge variant={c.variant}>{interviewsList.length}</Badge>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {interviewsList.map((interview : interviews) => {
                const candidateInfo = getCandidateInfo(users, interview.candidateId);
                const startTime = new Date(interview.startTime);

                return (
                  <Card className='hover:shadow-md transition-all' key={interview._id}>
                    {/* Card Header */}
                    <CardHeader className='p-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage src = {candidateInfo.image}/>
                          <AvatarFallback>{candidateInfo.initials}</AvatarFallback>
                        </Avatar>

                        <div>
                          <CardTitle className='text-base'> {candidateInfo.name} </CardTitle>
                          <p className='text-sm text-muted-foreground'> {interview.title} </p>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Card Content*/}

                    <CardContent className='p-4'>
                      <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                        <div className='flex items-center gap-1'>
                          <CalendarIcon className='size-4'/>
                          {format(startTime, "MMM dd")}
                        </div>

                        <div className='flex items-center gap-1'>
                          <ClockIcon className='size-4'/>
                          {format(startTime, "hh:mm a")}
                        </div>
                      </div>
                    </CardContent>

                    {/* Card Footer*/}

                    <CardFooter className='p-4 pt-0 flex flex-col gap-3'>

                      {interview.status === "completed" && (
                        <div className='flex gap-2 w-full'>
                          <Button className='flex-1' onClick={() => handleStatusUpdate(interview._id, "succeeded")}>
                            <CheckCircleIcon className='size-4 mr-2'/>
                            Pass
                          </Button>
                          <Button className='flex-1' onClick={() => handleStatusUpdate(interview._id, "failed")}>
                            <XCircleIcon className='size-4 mr-2'/>
                            Fail
                          </Button>
                        </div>
                      )}

                      <CommentDialog interviewId = {interview._id}/>

                    </CardFooter>

                  </Card>
                )
              })}

            </div>

          </section>
          )
        })}
      </div>
    </div>
  );
}

export default DashboardPage
