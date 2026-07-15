import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/dashboard/ChangePasswordForm";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({ where: { id: session!.user.id } });

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Segurança</h1>
      <p className="mt-1 text-sm text-ink-500">Gerencie a senha de acesso à sua conta.</p>

      <Card className="mt-8 p-6">
        {user?.passwordHash ? (
          <ChangePasswordForm />
        ) : (
          <p className="text-sm text-ink-500">
            Sua conta usa login social e não possui uma senha local para alterar.
          </p>
        )}
      </Card>
    </div>
  );
}
