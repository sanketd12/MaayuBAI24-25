import { authClient } from "@/lib/auth-client"
 
export default function UserProfile() {
    const { data: session, isPending } = authClient.useSession()

    if (isPending) return <UserProfileSkeleton />

    return (
        <div className="rounded-full bg-card text-white flex items-center justify-center p-3 w-8 h-8">
            {session?.user?.name?.charAt(0).toUpperCase()}
        </div>
    )
}

const UserProfileSkeleton = () => {
    return (
        <div className="rounded-full bg-card text-white flex items-center justify-center p-3 w-8 h-8">
           
        </div>
    )
}