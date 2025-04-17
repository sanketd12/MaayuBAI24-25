import CandidateTable from "./_components/candidate-table";
import { DataTable } from "./_components/table/data-table";
import { columns } from "./_components/table/columns";

export default function CandidateBucketPage() {
    return (
        // <CandidateTable />
        <DataTable columns={columns} data={[]} />
    )
}