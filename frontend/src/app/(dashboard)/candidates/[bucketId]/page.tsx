import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default function CandidateBucketPage() {
    return (
        // <CandidateTable />
        <DataTable columns={columns} data={[]} />
    )
}