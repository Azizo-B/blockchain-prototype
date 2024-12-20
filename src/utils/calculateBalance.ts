import { prisma } from "../data";

export async function calculateBalance(address: string): Promise<number> {
  const credits = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { toAddress: address, status:"completed" },
  });
  const debits = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { fromAddress: address, status:"completed" },
  });

  return (credits._sum.amount || 0) - (debits._sum.amount || 0);
}
