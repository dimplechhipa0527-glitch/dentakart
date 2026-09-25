import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { seedCategories, seedProducts, seedCoupons } from '../utils/seedData';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DentaKart B2B database seed...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.orderStatusLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.doctorProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 1. Create Admin
  const adminHashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dentakart.com',
      password: adminHashedPassword,
      name: 'DentaKart Operations Admin',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Created Admin user:', admin.email);

  // 2. Create Doctors
  const doctorHashedPassword = await bcrypt.hash('doctor123', 10);
  
  // Dr. Rahul Sharma (Primary demo doctor with 24 orders & ₹85,450 total spent)
  const drRahul = await prisma.user.create({
    data: {
      email: 'dr.rahul@smileclinic.com',
      password: doctorHashedPassword,
      name: 'Dr. Rahul Sharma (BDS, MDS Endo)',
      phone: '+91 98201 12345',
      role: 'DOCTOR',
      status: 'ACTIVE',
      doctorProfile: {
        create: {
          clinicName: 'Smile Dental Clinic & Implant Center',
          gstNumber: '27AABCU9603R1ZM',
          regNumber: 'DCI-MUM-84920',
          clinicPhone: '+91 98201 12345',
          clinicEmail: 'info@smileclinic.com',
          addressLine: 'Shop 4-5, Crystal Plaza, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          totalSpent: 85450,
          orderCount: 24
        }
      },
      addresses: {
        create: [
          {
            type: 'SHIPPING',
            name: 'Dr. Rahul Sharma',
            clinicName: 'Smile Dental Clinic & Implant Center',
            phone: '+91 98201 12345',
            addressLine1: 'Shop 4-5, Crystal Plaza, Link Road, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400053',
            gstNumber: '27AABCU9603R1ZM',
            isDefault: true
          },
          {
            type: 'BILLING',
            name: 'Smile Dental Clinic & Implant Center',
            clinicName: 'Smile Dental Clinic',
            phone: '+91 98201 12345',
            addressLine1: 'Shop 4-5, Crystal Plaza, Link Road, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400053',
            gstNumber: '27AABCU9603R1ZM',
            isDefault: true
          }
        ]
      }
    },
    include: { doctorProfile: true, addresses: true }
  });

  // Dr. Neha Verma
  const drNeha = await prisma.user.create({
    data: {
      email: 'dr.neha@orthocare.com',
      password: doctorHashedPassword,
      name: 'Dr. Neha Verma (MDS Ortho)',
      phone: '+91 98110 54321',
      role: 'DOCTOR',
      status: 'ACTIVE',
      doctorProfile: {
        create: {
          clinicName: 'OrthoCare Specialty Clinic',
          gstNumber: '07AAACL1452D1Z3',
          regNumber: 'DCI-DEL-10294',
          clinicPhone: '+91 98110 54321',
          clinicEmail: 'contact@orthocare.com',
          addressLine: 'A-14, Green Park Main',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          totalSpent: 42300,
          orderCount: 11
        }
      },
      addresses: {
        create: [
          {
            type: 'SHIPPING',
            name: 'Dr. Neha Verma',
            clinicName: 'OrthoCare Specialty Clinic',
            phone: '+91 98110 54321',
            addressLine1: 'A-14, Green Park Main',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110016',
            gstNumber: '07AAACL1452D1Z3',
            isDefault: true
          }
        ]
      }
    }
  });

  // Dr. Amit Patel
  const drAmit = await prisma.user.create({
    data: {
      email: 'dr.amit@dentapex.com',
      password: doctorHashedPassword,
      name: 'Dr. Amit Patel (BDS)',
      phone: '+91 99090 98765',
      role: 'DOCTOR',
      status: 'ACTIVE',
      doctorProfile: {
        create: {
          clinicName: 'Apex Dental Hub',
          gstNumber: '24AACCA1234F1ZX',
          regNumber: 'DCI-GUJ-74921',
          clinicPhone: '+91 99090 98765',
          clinicEmail: 'care@dentapex.com',
          addressLine: '302, Titanium City Centre, Satellite',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380015',
          totalSpent: 19800,
          orderCount: 5
        }
      },
      addresses: {
        create: [
          {
            type: 'SHIPPING',
            name: 'Dr. Amit Patel',
            clinicName: 'Apex Dental Hub',
            phone: '+91 99090 98765',
            addressLine1: '302, Titanium City Centre, Satellite',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380015',
            gstNumber: '24AACCA1234F1ZX',
            isDefault: true
          }
        ]
      }
    }
  });

  console.log('✅ Created demo doctors: Dr. Rahul, Dr. Neha, Dr. Amit');

  // 3. Create Categories & Subcategories
  const categoryMap = new Map<string, string>(); // slug -> id

  for (let i = 0; i < seedCategories.length; i++) {
    const cat = seedCategories[i];
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description,
        displayOrder: i + 1
      }
    });
    categoryMap.set(cat.slug, parent.id);

    for (let j = 0; j < cat.subcategories.length; j++) {
      const sub = cat.subcategories[j];
      const subCat = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          parentId: parent.id,
          displayOrder: j + 1
        }
      });
      categoryMap.set(sub.slug, subCat.id);
    }
  }
  console.log(`✅ Created ${categoryMap.size} Categories and Subcategories`);

  // 4. Create Products
  const createdProducts: any[] = [];

  for (const prod of seedProducts) {
    const catId = categoryMap.get(prod.categorySlug) || categoryMap.get('dental-materials')!;
    const created = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        brand: prod.brand,
        sku: prod.sku,
        hsnCode: prod.hsnCode,
        description: prod.description,
        specifications: JSON.stringify(prod.specifications),
        price: prod.price,
        mrp: prod.mrp,
        discount: prod.discount,
        gstPercent: prod.gstPercent,
        stock: prod.stock,
        lowStockThreshold: prod.lowStockThreshold,
        packSize: prod.packSize,
        manufacturer: prod.manufacturer,
        expiryInfo: prod.expiryInfo,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        isActive: true,
        images: JSON.stringify(prod.images),
        categoryId: catId
      }
    });
    createdProducts.push(created);

    // Create initial inventory log
    await prisma.inventoryLog.create({
      data: {
        productId: created.id,
        previousStock: 0,
        newStock: prod.stock,
        changeQuantity: prod.stock,
        changeType: 'RESTOCK',
        reason: 'Initial Opening Stock Intake',
        adminName: 'Super Admin'
      }
    });
  }
  console.log(`✅ Created ${createdProducts.length} Dental Products`);

  // 5. Create Coupons
  for (const coup of seedCoupons) {
    await prisma.coupon.create({
      data: {
        code: coup.code,
        description: coup.description,
        discountType: coup.discountType,
        discountValue: coup.discountValue,
        minOrderValue: coup.minOrderValue,
        maxDiscount: coup.maxDiscount || null,
        usageLimit: (coup as any).usageLimit || 100,
        isActive: coup.isActive
      }
    });
  }
  console.log('✅ Created Seed Coupons: WELCOME10, DENTAL500, FREESHIP');

  // 6. Create Product Reviews
  if (createdProducts.length > 0) {
    const endomotorProd = createdProducts[0];
    const filesProd = createdProducts.find(p => p.sku === 'IE-TE-FILES-ASSORTED') || createdProducts[4];
    const compositeProd = createdProducts.find(p => p.sku === 'IE-TE-COMP-4G') || createdProducts[7];

    if (endomotorProd) {
      await prisma.review.create({
        data: {
          productId: endomotorProd.id,
          userId: drRahul.id,
          doctorName: 'Dr. Rahul Sharma',
          clinicName: 'Smile Dental Clinic',
          rating: 5,
          title: 'Exceptional endomotor with precise torque control',
          comment: 'We have been using the True Endo Cordless Endomotor for all molar root canals. Auto-reverse is instant and battery life easily lasts full day.',
          isApproved: true
        }
      });
    }

    if (compositeProd) {
      await prisma.review.create({
        data: {
          productId: compositeProd.id,
          userId: drNeha.id,
          doctorName: 'Dr. Neha Verma',
          clinicName: 'OrthoCare Specialty Clinic',
          rating: 5,
          title: 'Great chameleon blending effect',
          comment: 'Very reliable composite resin. Fast curing, non-sticky handling, and high gloss finish.',
          isApproved: true
        }
      });
    }

    if (filesProd) {
      await prisma.review.create({
        data: {
          productId: filesProd.id,
          userId: drRahul.id,
          doctorName: 'Dr. Rahul Sharma',
          clinicName: 'Smile Dental Clinic',
          rating: 5,
          title: 'Top quality Gold NiTi Rotary Files',
          comment: 'Gold metallurgy drastically reduces file separation in curved canals. Highly recommended for endodontists.',
          isApproved: true
        }
      });
    }
  }

  // 7. Create Sample Orders for Dr. Rahul and others
  const prod1 = createdProducts[0]; // Endomotor
  const prod2 = createdProducts.find(p => p.sku === 'IE-TE-NITRILE-BOX') || createdProducts[1]; // Nitrile Gloves
  const prod3 = createdProducts.find(p => p.sku === 'IE-TE-FILES-ASSORTED') || createdProducts[2]; // Files

  // Order 1 - Confirmed / Processing (DK10254 - Matching User Spec!)
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'DK10254',
      userId: drRahul.id,
      status: 'PROCESSING',
      subtotal: 8750,
      gstAmount: 1350,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 10100,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'UPI',
      transactionId: 'TXN982345719',
      trackingNumber: 'BLUEDART-882947192',
      courierName: 'Blue Dart Express',
      shippingAddress: JSON.stringify({
        name: 'Dr. Rahul Sharma',
        clinicName: 'Smile Dental Clinic & Implant Center',
        phone: '+91 98201 12345',
        addressLine1: 'Shop 4-5, Crystal Plaza, Link Road, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        gstNumber: '27AABCU9603R1ZM'
      }),
      billingAddress: JSON.stringify({
        name: 'Smile Dental Clinic & Implant Center',
        clinicName: 'Smile Dental Clinic',
        phone: '+91 98201 12345',
        addressLine1: 'Shop 4-5, Crystal Plaza, Link Road, Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        gstNumber: '27AABCU9603R1ZM'
      }),
      items: {
        create: [
          {
            productId: prod1.id,
            productName: prod1.name,
            brand: prod1.brand,
            sku: prod1.sku,
            price: prod1.price,
            mrp: prod1.mrp,
            gstPercent: prod1.gstPercent,
            quantity: 1,
            total: prod1.price
          },
          {
            productId: prod2.id,
            productName: prod2.name,
            brand: prod2.brand,
            sku: prod2.sku,
            price: prod2.price,
            mrp: prod2.mrp,
            gstPercent: prod2.gstPercent,
            quantity: 1,
            total: prod2.price
          },
          {
            productId: prod3.id,
            productName: prod3.name,
            brand: prod3.brand,
            sku: prod3.sku,
            price: prod3.price,
            mrp: prod3.mrp,
            gstPercent: prod3.gstPercent,
            quantity: 1,
            total: prod3.price
          }
        ]
      },
      statusLogs: {
        create: [
          { status: 'PLACED', note: 'Order placed by Dr. Rahul Sharma via UPI', updatedBy: 'System' },
          { status: 'CONFIRMED', note: 'Payment verified successfully (TXN982345719)', updatedBy: 'System' },
          { status: 'PROCESSING', note: 'Order packed and assigned to Blue Dart Express', updatedBy: 'Super Admin' }
        ]
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2026-10254',
          subtotal: 8750,
          gstAmount: 1350,
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: 10100,
          clinicName: 'Smile Dental Clinic & Implant Center',
          doctorName: 'Dr. Rahul Sharma',
          gstNumber: '27AABCU9603R1ZM',
          clinicAddress: 'Shop 4-5, Crystal Plaza, Link Road, Andheri West, Mumbai, Maharashtra - 400053'
        }
      }
    }
  });

  // Order 2 - Shipped (DK10241)
  const airotorProd = createdProducts.find(p => p.sku === 'IE-HP-STANDARD-AIROTOR') || createdProducts[5];
  const alginateProd = createdProducts.find(p => p.sku === 'IE-DRIKAM-NEOALGIN') || createdProducts[8];

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'DK10241',
      userId: drAmit.id,
      status: 'SHIPPED',
      subtotal: 2050,
      gstAmount: 342,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 2392,
      paymentStatus: 'SUCCESS',
      paymentMethod: 'CARD',
      transactionId: 'TXN918237412',
      trackingNumber: 'DELHIVERY-7749182',
      courierName: 'Delhivery Surface',
      shippingAddress: JSON.stringify({
        name: 'Dr. Amit Patel',
        clinicName: 'Apex Dental Hub',
        phone: '+91 99090 98765',
        addressLine1: '302, Titanium City Centre, Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        gstNumber: '24AACCA1234F1ZX'
      }),
      billingAddress: JSON.stringify({
        name: 'Apex Dental Hub',
        clinicName: 'Apex Dental Hub',
        phone: '+91 99090 98765',
        addressLine1: '302, Titanium City Centre, Satellite',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        gstNumber: '24AACCA1234F1ZX'
      }),
      items: {
        create: [
          {
            productId: airotorProd.id,
            productName: airotorProd.name,
            brand: airotorProd.brand,
            sku: airotorProd.sku,
            price: airotorProd.price,
            mrp: airotorProd.mrp,
            gstPercent: airotorProd.gstPercent,
            quantity: 1,
            total: airotorProd.price
          },
          {
            productId: alginateProd.id,
            productName: alginateProd.name,
            brand: alginateProd.brand,
            sku: alginateProd.sku,
            price: alginateProd.price,
            mrp: alginateProd.mrp,
            gstPercent: alginateProd.gstPercent,
            quantity: 1,
            total: alginateProd.price
          }
        ]
      },
      statusLogs: {
        create: [
          { status: 'PLACED', note: 'Order placed online', updatedBy: 'System' },
          { status: 'CONFIRMED', note: 'Payment verified', updatedBy: 'System' },
          { status: 'PROCESSING', note: 'Dispatched from Silvassa Central Hub', updatedBy: 'Super Admin' },
          { status: 'SHIPPED', note: 'In transit via Delhivery Express', updatedBy: 'Super Admin' }
        ]
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2026-10241',
          subtotal: 2050,
          gstAmount: 342,
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: 2392,
          clinicName: 'Apex Dental Hub',
          doctorName: 'Dr. Amit Patel',
          gstNumber: '24AACCA1234F1ZX',
          clinicAddress: '302, Titanium City Centre, Satellite, Ahmedabad - 380015'
        }
      }
    }
  });

  // Order 3 - Delivered (DK10198)
  const lightCureProd = createdProducts.find(p => p.sku === 'IE-HX-LC-X3') || createdProducts[12];
  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'DK10198',
      userId: drNeha.id,
      status: 'DELIVERED',
      subtotal: lightCureProd.price,
      gstAmount: Math.round(lightCureProd.price * 0.18),
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: lightCureProd.price + Math.round(lightCureProd.price * 0.18),
      paymentStatus: 'SUCCESS',
      paymentMethod: 'NETBANKING',
      transactionId: 'TXN827419201',
      trackingNumber: 'BLUEDART-5510293',
      courierName: 'Blue Dart Express',
      shippingAddress: JSON.stringify({
        name: 'Dr. Neha Verma',
        clinicName: 'OrthoCare Specialty Clinic',
        phone: '+91 98110 54321',
        addressLine1: 'A-14, Green Park Main',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        gstNumber: '07AAACL1452D1Z3'
      }),
      billingAddress: JSON.stringify({
        name: 'OrthoCare Specialty Clinic',
        clinicName: 'OrthoCare Specialty Clinic',
        phone: '+91 98110 54321',
        addressLine1: 'A-14, Green Park Main',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        gstNumber: '07AAACL1452D1Z3'
      }),
      items: {
        create: [
          {
            productId: lightCureProd.id,
            productName: lightCureProd.name,
            brand: lightCureProd.brand,
            sku: lightCureProd.sku,
            price: lightCureProd.price,
            mrp: lightCureProd.mrp,
            gstPercent: lightCureProd.gstPercent,
            quantity: 1,
            total: lightCureProd.price
          }
        ]
      },
      statusLogs: {
        create: [
          { status: 'PLACED', note: 'Order placed', updatedBy: 'System' },
          { status: 'CONFIRMED', note: 'Card payment cleared', updatedBy: 'System' },
          { status: 'PROCESSING', note: 'Dispatched from Silvassa Central Hub', updatedBy: 'Super Admin' },
          { status: 'SHIPPED', note: 'Shipped with Blue Dart Express', updatedBy: 'Super Admin' },
          { status: 'OUT_FOR_DELIVERY', note: 'Out for delivery in Green Park', updatedBy: 'Courier Partner' },
          { status: 'DELIVERED', note: 'Package handed over and verified by Dr. Neha Verma', updatedBy: 'Courier Partner' }
        ]
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-2026-10198',
          subtotal: lightCureProd.price,
          gstAmount: Math.round(lightCureProd.price * 0.18),
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: lightCureProd.price + Math.round(lightCureProd.price * 0.18),
          clinicName: 'OrthoCare Specialty Clinic',
          doctorName: 'Dr. Neha Verma',
          gstNumber: '07AAACL1452D1Z3',
          clinicAddress: 'A-14, Green Park Main, New Delhi - 110016'
        }
      }
    }
  });

  // 8. Add Wishlist and Notifications for Dr. Rahul
  await prisma.wishlistItem.create({
    data: {
      userId: drRahul.id,
      productId: createdProducts[1].id
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: drRahul.id,
        title: 'Order Dispatched #DK10254',
        message: 'Your order consisting of 3M Composite & Gloves has been packed and handed to Blue Dart (Tracking #BLUEDART-882947192).',
        type: 'ORDER',
        isRead: false,
        link: '/orders/DK10254'
      },
      {
        userId: drRahul.id,
        title: 'Exclusive Clinic Coupon Activated! 🏷️',
        message: 'Use code DENTAL500 to get flat ₹500 OFF on your next equipment or material restock over ₹5,000.',
        type: 'PROMO',
        isRead: false,
        link: '/products'
      },
      {
        userId: drRahul.id,
        title: 'Low Stock Alert: Woodpecker Ultrasonic Scaler',
        message: 'Only 5 units remaining in stock. Restock your clinic instruments today with special B2B pricing.',
        type: 'STOCK',
        isRead: true,
        link: '/products'
      }
    ]
  });

  console.log('✅ Created sample orders, wishlist, notifications, and GST invoices.');
  console.log('🎉 DentaKart B2B database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
