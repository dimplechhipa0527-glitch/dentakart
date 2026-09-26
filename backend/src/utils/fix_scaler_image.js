const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.product.findFirst({
    where: {
      OR: [
        { slug: 'true-endo-universal-scaler-tips-pack-5' },
        { name: { contains: 'Scaler Tips Replacement' } }
      ]
    }
  });

  if (p) {
    console.log('Found product:', p.name, 'current image prefix:', p.images.slice(0, 60));
    await prisma.product.update({
      where: { id: p.id },
      data: {
        images: JSON.stringify([
          '/images/products/true-endo-scaler-tips-pack5.jpg',
          '/images/products/true-endo-scaler-tips-pack5-card.jpg'
        ])
      }
    });
    console.log('Successfully updated product image in database!');
  } else {
    console.log('Scaler tips product not found in database');
  }

  // Also ensure essential products Karam Nitrile Gloves and Waldent Patient Bibs exist in database
  const gloveCat = await prisma.category.findFirst({ where: { OR: [{ slug: 'gloves' }, { slug: 'consumables' }] } });
  const catId = gloveCat ? gloveCat.id : 'cmtwf47yr000u2upk9j0yey1p';

  await prisma.product.upsert({
    where: { slug: 'karam-nitrile-gloves-100-pcs' },
    update: {
      name: 'Karam Nitrile Gloves (100 pcs)',
      brand: 'Karam',
      price: 450,
      mrp: 600,
      stock: 200,
      isActive: true,
      images: JSON.stringify(['/images/products/true-endo-nitrile-gloves.jpg'])
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
      categoryId: catId,
      hsnCode: '4015',
      gstPercent: 5,
      packSize: 'Box of 100 Gloves',
      specifications: '{}',
      isActive: true
    }
  });
  console.log('Ensured Karam Nitrile Gloves in database');

  await prisma.product.upsert({
    where: { slug: 'waldent-dental-patient-bibs-500' },
    update: {
      name: 'Waldent Dental Patient Bibs (500)',
      brand: 'Waldent',
      price: 890,
      mrp: 1200,
      stock: 120,
      isActive: true,
      images: JSON.stringify(['/images/products/true-endo-rvg-sleeves.jpg'])
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
      images: JSON.stringify(['/images/products/true-endo-rvg-sleeves.jpg']),
      categoryId: catId,
      hsnCode: '4818',
      gstPercent: 12,
      packSize: 'Pack of 500 Sheets',
      specifications: '{}',
      isActive: true
    }
  });
  console.log('Ensured Waldent Patient Bibs in database');
}

main().catch(console.error).finally(() => prisma.$disconnect());
