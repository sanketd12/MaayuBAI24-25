import Link from "next/link";
import { usePathname } from "next/navigation"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

export default function PlatformBreadcrumb() {
    const pathname = usePathname();
    const pathnames = pathname.split("/").filter(Boolean);

    return (
        <div className="flex items-center gap-2">
            <Breadcrumb>
                <BreadcrumbList>
                    {pathnames.map((name, index) => (
                        <BreadcrumbItem key={index}>
                            <BreadcrumbLink href={`/${name}`}>{name.charAt(0).toUpperCase() + name.slice(1)}</BreadcrumbLink>
                        </BreadcrumbItem>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}