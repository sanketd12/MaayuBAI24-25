import { HeroHeader } from "~/components/hero6-header";

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <HeroHeader />
            {children}
        </div>
    )
}