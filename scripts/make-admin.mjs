// Promove um usuário existente para ADMIN.
// Uso: node scripts/make-admin.mjs email@exemplo.com
import { PrismaClient } from "@prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/make-admin.mjs email@exemplo.com");
  process.exit(1);
}

const prisma = new PrismaClient();

const user = await prisma.user.update({
  where: { email: email.toLowerCase() },
  data: { role: "ADMIN" },
});

console.log(`Usuário ${user.email} agora é ADMIN.`);
await prisma.$disconnect();
