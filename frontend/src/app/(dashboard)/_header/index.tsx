import UserProfile from "./user-profile";
import PlatformBreadcrumb from "./breadcrumb";
import { Separator } from "~/components/ui/separator";

export default function PlatformHeader() {
    return (
        <>
            <div className="flex items-center justify-between px-3 py-4">
                <PlatformBreadcrumb />
                <div className="flex items-center gap-2">
                    <UserProfile />
                </div>
            </div>
            <Separator />
        </>
    )
}