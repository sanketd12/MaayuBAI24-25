import { createFileRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Briefcase, UserCog, Settings, User } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import PlatformHeader from '@/components/platform/header'
import { useState } from 'react'

export const Route = createFileRoute('/_platform')({
    component: RouteComponent,
})

const PLATFORM_LINKS = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Jobs",
        href: "/jobs",
        icon: (
            <Briefcase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Candidate Pool",
        href: "/candidates",
        icon: (
            <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
    {
        label: "Settings",
        href: "/settings",
        icon: (
            <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
    },
];

function RouteComponent() {
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border overflow-hidden",
                "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {PLATFORM_LINKS.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Manu Arora",
                                href: "#",
                                icon: (
                                    <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <ContentLayout>
                <Outlet />
            </ContentLayout>
        </div>
    );
}

function ContentLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <PlatformHeader />
            <div className="px-4 mt-4">{children}</div>
        </div>
    )
}

export const Logo = () => {
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Maayu AI
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};