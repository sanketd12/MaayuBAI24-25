import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLocation } from "@tanstack/react-router";

export default function PlatformBreadcrumb() {
    const { pathname } = useLocation();
    const pathnames = pathname.split("/").filter(Boolean);

    const breadcrumbItems = mapBreadcrumbItems(pathnames);

    return (
        <div className="flex items-center gap-2">
            <Breadcrumb>
                <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                        <>
                            {index !== 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem key={index} className="hover:underline hover:text-purple-300 transition-colors duration-200">
                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

// app is small enough to manually map the breadcrumb items
const mapBreadcrumbItems = (pathnames: string[]): { label: string, href: string }[] => {
    if (pathnames.length === 0) return [];
    else if (pathnames.length === 1) {
        if (pathnames[0] === "candidates") return [{ label: "Resume Buckets", href: "/candidates" }];
        return [{ label: pathnames[0].charAt(0).toUpperCase() + pathnames[0].slice(1), href: `/${pathnames[0]}` }];
    }
    else if (pathnames.length === 2) {
        if (pathnames[0] === "candidates") return [{ label: "Resume Buckets", href: "/candidates" }, { label: "Table", href: `/${pathnames[1]}` }];
        else if (pathnames[0] === "jobs") return [{ label: "Jobs", href: "/jobs" }, { label: "Listing", href: `/${pathnames[1]}` }];
    }
    return [];
}