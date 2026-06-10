import { Award, Medal, Star, Trophy } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { DataTable } from "../components/common/DataTable";
import { leaderboard } from "../data/mockData";

const columns = [
  { accessorKey: "rank", header: "Rank" },
  { accessorKey: "intern", header: "Intern" },
  { accessorKey: "farmers", header: "Farmers" },
  { accessorKey: "demos", header: "Demos" },
  { accessorKey: "reports", header: "Reports" },
  { accessorKey: "score", header: "Score" },
];

export function Leaderboard() {
  return (
    <>
      <PageHeader title="Leaderboard" description="Recognize top-performing interns by farmer registrations, demo quality, reports, and field execution score." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Gold" value={leaderboard[0].intern} icon={Trophy} trend={`${leaderboard[0].score} score`} />
        <StatCard label="Silver" value={leaderboard[1].intern} icon={Medal} trend={`${leaderboard[1].score} score`} />
        <StatCard label="Bronze" value={leaderboard[2].intern} icon={Award} trend={`${leaderboard[2].score} score`} />
        <StatCard label="Rising Star" value={leaderboard[3].intern} icon={Star} trend={`${leaderboard[3].score} score`} />
      </div>
      <DataTable data={leaderboard} columns={columns} />
    </>
  );
}
