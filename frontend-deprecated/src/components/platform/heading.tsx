import { TextEffect } from "../ui/text-effect";

export type PlatformHeadingProps = {
    title: string;
    description?: string;
}

export default function PlatformHeading({
    title,
    description,
}: PlatformHeadingProps) {
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{title}</h1>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
    )
}