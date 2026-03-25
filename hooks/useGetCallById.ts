import { useEffect, useState } from "react";
import {Call, useStreamVideoClient} from "@stream-io/video-react-sdk";

const useGetCallByID = (id: string | string[]) => {
    const [call, setCall] = useState<Call>();
    const [isCallLoading,setIsCallLoading] = useState<boolean>(true);

    const client = useStreamVideoClient();

    useEffect(() =>{
        if(!client) {
            console.error("StreamVideoClient is not available");
            return;
        }
        const getCall = async() => {
            try{
                const {calls} = await client.queryCalls({filter_conditions: {id}});
                if(calls.length > 0)setCall(calls[0]);

            }catch(error){
                console.error("Error fetching call by ID:", error);
                setCall(undefined);

            }finally{
                setIsCallLoading(false);
            }
        };
        getCall();
    }, [ client, id]);

    return {call, isCallLoading};
}

export default useGetCallByID;