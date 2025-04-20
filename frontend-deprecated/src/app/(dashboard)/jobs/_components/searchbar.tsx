import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";

export default function JobSearchBar({
    value,
    onChange,
}: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search by title, description, location..."
                value={value}
                onChange={onChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
        </div>
    );
}