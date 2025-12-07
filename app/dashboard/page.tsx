import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4 text-xl">Welcome, {session.user?.email}</p>
    </div>
  );
}
