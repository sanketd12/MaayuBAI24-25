import UserProfile from "./user-profile";
import PlatformBreadcrumb from "./breadcrumb";

export default function PlatformHeader() {
    return (
        <div className="flex items-center justify-between">
            <PlatformBreadcrumb />
            <div className="flex items-center gap-2">
                <UserProfile />
            </div>
        </div>
    )
}