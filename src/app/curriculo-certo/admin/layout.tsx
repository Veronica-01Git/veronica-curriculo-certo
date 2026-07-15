import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { APP_BASE } from "@/lib/routes";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect(`${APP_BASE}/dashboard`);

  return (
    <div className="flex min-h-screen bg-ink-50/30">
      <Sidebar userName={session.user.name ?? session.user.email ?? "Admin"} role={session.user.role} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
