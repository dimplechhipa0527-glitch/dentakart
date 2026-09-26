const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.coupon.updateMany({
    where: { code: 'DENTA100' },
    data: { description: 'Flat ₹100 off on express clinic orders over ₹1,000' }
  });
  await prisma.coupon.updateMany({
    where: { code: 'FREESHIP' },
    data: { description: 'Free express priority courier on all clinic orders' }
  });
  console.log('Database coupon descriptions successfully refreshed!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
