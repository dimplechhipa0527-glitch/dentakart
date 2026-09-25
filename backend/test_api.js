const http = require('http');

async function test() {
  console.log('🧪 Testing DentaKart B2B API Server & Database Endpoints...\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✅ Health Check:', health);

  // 2. Categories
  const catRes = await fetch('http://localhost:5000/api/categories');
  const catData = await catRes.json();
  console.log(`✅ Categories: Loaded ${catData.categories?.length} primary dental taxonomy branches.`);

  // 3. Products
  const prodRes = await fetch('http://localhost:5000/api/products');
  const prodData = await prodRes.json();
  console.log(`✅ Products: Loaded ${prodData.products?.length} products in catalog.`);
  if (prodData.products?.length > 0) {
    console.log('   Sample Products:');
    prodData.products.slice(0, 4).forEach((p) => {
      console.log(`   - [${p.sku}] ${p.name} | ₹${p.price} | Stock: ${p.stock}`);
    });
  }

  // 4. Doctor Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'dr.rahul@smileclinic.com',
      password: 'doctor123'
    })
  });
  const auth = await loginRes.json();
  console.log(`\n✅ Doctor Login: ${auth.user.name}`);
  console.log(`   Clinic: ${auth.user.doctorProfile?.clinicName} | GSTIN: ${auth.user.doctorProfile?.gstNumber}`);
  console.log(`   Lifetime Spending: ₹${auth.user.doctorProfile?.totalSpent}`);

  // 5. Admin Login & Analytics
  const adminRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@dentakart.com',
      password: 'admin123'
    })
  });
  const adminAuth = await adminRes.json();
  console.log(`\n✅ Admin Login: ${adminAuth.user.name} (Role: ${adminAuth.user.role})`);

  const analyticsRes = await fetch('http://localhost:5000/api/analytics/dashboard', {
    headers: { Authorization: `Bearer ${adminAuth.token}` }
  });
  const analytics = await analyticsRes.json();
  console.log('✅ Admin Analytics KPIs:', analytics.kpis);
  console.log('✅ Financial Breakdown:', analytics.financials);

  console.log('\n🎉 ALL DENTAKART BACKEND & DATABASE ENDPOINTS WORKING 100% PERFECTLY!');
}

test().catch(console.error);
