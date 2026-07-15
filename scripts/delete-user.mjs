// Remove um usuário e todos os dados vinculados (currículos, assinatura, etc).
// Uso: node scripts/delete-user.mjs email@exemplo.com
import { PrismaClient } from "@prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("Uso: node scripts/delete-user.mjs email@exemplo.com");
  process.exit(1);
}

const prisma = new PrismaClient();

const user = await prisma.user.delete({
  where: { email: email.toLowerCase() },
});

console.log(`Usuário ${user.email} removido.`);
await prisma.$disconnect();
