import useMeetingActions from "@/hooks/useMeetingAction";
import { Doc } from "@/convex/_generated/dataModel";
import { getMeetingStatus } from "@/lib/utils";
import { format } from "date-fns";
import {Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Interview = Doc<"interviews">;


function MeetingCard({interview} : {interview: Interview}) {
    const {joinMeeting} = useMeetingActions();

    const status  = getMeetingStatus(interview);
    const formattedDate = format(new Date(interview.startTime), "EEEE, MMMM d . h:mm a");

  return (
    <Card>
        <CardHeader className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    {formattedDate}
                </div>
                <Badge
                    variant={ 
                        status === "live" ? "default" : status === "upcoming" ? "secondary": "outline"
                    }>
                   {status === "live" ? "Live" : status === "upcoming" ? "Upcoming" : "Completed"}
                </Badge>
            </div>
            <CardTitle>{interview.title}</CardTitle>
            {interview.description && <CardDescription>{interview.description}</CardDescription>}
        </CardHeader>
        <CardContent>
            {status === "live" && (
            <Button className="w-full" onClick={() => {joinMeeting(interview.streamCallId)}}>
                Join Meeting
            </Button>)}
            
            {status === "upcoming" && 
            (<Button className="w-full" variant="outline" disabled>
                Waiting to Start
            </Button>)}

        </CardContent>
    </Card>
  )
}

export default MeetingCard
