import { UserCircleIcon } from "lucide-react"
import { Doc } from "@/convex/_generated/dataModel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = Doc<"users">

function UserInfo({user} : {user:User}) {
  return (
    <div className="flex items-center gap-2">
        <Avatar>
            <AvatarImage src = {user.image} />
            <AvatarFallback>
                <UserCircleIcon className="size-3" />
            </AvatarFallback>
        </Avatar>
        <span>{user.name}</span>
      
    </div>
  )
}

export default UserInfo
