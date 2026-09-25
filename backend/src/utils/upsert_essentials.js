const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Upsert SMILE25 coupon
  const coupon = await prisma.coupon.upsert({
    where: { code: 'SMILE25' },
    update: {
      description: '25% flat discount for dental clinics and orthodontists',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderValue: 250,
      maxDiscount: 1000,
      isActive: true
    },
    create: {
      code: 'SMILE25',
      description: '25% flat discount for dental clinics and orthodontists',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderValue: 250,
      maxDiscount: 1000,
      isActive: true
    }
  });
  console.log('Upserted coupon:', coupon.code);

  // Check or upsert Patient Bibs
  const cat = await prisma.category.findFirst({ where: { slug: 'consumables' } });
  const bibs = await prisma.product.upsert({
    where: { slug: 'waldent-dental-patient-bibs-500' },
    update: {
      name: 'Waldent Dental Patient Bibs (500)',
      brand: 'Waldent',
      price: 890,
      mrp: 1200,
      stock: 120,
      isActive: true
    },
    create: {
      name: 'Waldent Dental Patient Bibs (500)',
      slug: 'waldent-dental-patient-bibs-500',
      description: '3-Ply embossed waterproof patient napkins with polyethylene backing for maximum fluid resistance and patient hygiene during clinical procedures.',
      brand: 'Waldent',
      sku: 'WAL-BIB-500',
      price: 890,
      mrp: 1200,
      stock: 120,
      images: JSON.stringify(['https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=300&q=80']),
      categoryId: cat ? cat.id : 'cmtwf489f00042upk8o79e5z5',
      hsnCode: '4818',
      gstPercent: 12,
      packSize: 'Pack of 500 Sheets',
      specifications: '{}',
      isActive: true
    }
  });
  console.log('Upserted product:', bibs.name, bibs.slug);

  // Also ensure Karam Nitrile Gloves is upserted/matched
  const gloveCat = await prisma.category.findFirst({ where: { slug: 'gloves' } });
  const gloves = await prisma.product.upsert({
    where: { slug: 'karam-nitrile-gloves-100-pcs' },
    update: {
      name: 'Karam Nitrile Gloves (100 pcs)',
      brand: 'Karam',
      price: 450,
      mrp: 600,
      stock: 200,
      isActive: true
    },
    create: {
      name: 'Karam Nitrile Gloves (100 pcs)',
      slug: 'karam-nitrile-gloves-100-pcs',
      description: 'Medical powder-free nitrile examination gloves (100 pcs) providing micro-textured grip and tactile sensitivity.',
      brand: 'Karam',
      sku: 'KARAM-GLV-100',
      price: 450,
      mrp: 600,
      stock: 200,
      images: JSON.stringify(['/images/products/true-endo-nitrile-gloves.jpg']),
      categoryId: gloveCat ? gloveCat.id : 'cmtwf489f00042upk8o79e5z5',
      hsnCode: '4015',
      gstPercent: 5,
      packSize: 'Box of 100 Gloves',
      specifications: '{}',
      isActive: true
    }
  });
  console.log('Upserted product:', gloves.name, gloves.slug);
}

main().catch(console.error).finally(() => prisma.$disconnect());
