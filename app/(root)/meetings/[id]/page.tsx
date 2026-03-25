"use client";

import LoaderUI from "@/components/LoaderUI";
import useGetCallByID from "@/hooks/useGetCallById";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {StreamCall, StreamTheme} from "@stream-io/video-react-sdk";
import {useState} from "react";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";

function MeetingPage(){
  const {id} = useParams();
  const {isLoaded} = useUser();
  const {call, isCallLoading} = useGetCallByID(id);

  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);

  if(!isLoaded || isCallLoading) return <LoaderUI/>

  if(!call) {
    return (
      <div className = "flex items-center justify-center">
        <p className = "text-2xl">Meeting not found</p>
      </div>
    )
  }

  return(
    <StreamCall call = {call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup onSetupComplete = {() => setIsSetupComplete(true)}/>

        ) : (
          <MeetingRoom/>
        )}
      </StreamTheme>
    </StreamCall>
  )
}

export default MeetingPage;
