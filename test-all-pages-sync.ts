import http from 'http';

const BASE_URL = 'http://localhost:3000';

function request(method: string, path: string, body?: any): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let data = null;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode || 0, data });
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runComprehensiveAudit() {
  console.log('===============================================================');
  console.log('🔍 TAXIAPP COMPREHENSIVE ALL-PAGES & API SYNC AUDIT');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(category: string, name: string, fn: () => Promise<boolean>) {
    const label = `[${category.toUpperCase()}] ${name}`;
    try {
      const ok = await fn();
      if (ok) {
        console.log(`✅ PASS: ${label}`);
        passed++;
      } else {
        console.log(`❌ FAIL: ${label}`);
        failed++;
      }
    } catch (err: any) {
      console.log(`❌ FAIL: ${label} -> ${err.message}`);
      failed++;
    }
  }

  // 1. PAGE: HEALTH & DATABASE ENGINE
  await check('Database', 'Engine Status (/api/admin/db/status)', async () => {
    const res = await request('GET', '/api/admin/db/status');
    return res.status === 200 && typeof res.data === 'object';
  });

  await check('Database', 'Data Export Dump (/api/admin/backup/export)', async () => {
    const res = await request('GET', '/api/admin/backup/export');
    return res.status === 200 && typeof res.data === 'object';
  });

  // 2. PAGE: DASHBOARD & OPERATIONAL STATS
  await check('Dashboard', 'Real-time Metrics Feed (/api/admin/stats)', async () => {
    const res = await request('GET', '/api/admin/stats');
    return res.status === 200 && Array.isArray(res.data) && res.data.length >= 4;
  });

  // 3. PAGE: REVENUE & ANALYTICS
  await check('Analytics', 'Gross Volume, Commission & Ticket Size (/api/admin/analytics)', async () => {
    const res = await request('GET', '/api/admin/analytics');
    return res.status === 200 && typeof res.data.grossVolume === 'number' && typeof res.data.platformCommission === 'number';
  });

  // 4. PAGE: RIDERS MANAGEMENT
  let riderId = '';
  await check('Riders', 'Create Rider Record (/api/admin/riders)', async () => {
    const res = await request('POST', '/api/admin/riders', {
      name: 'Priya Sharma Pune',
      email: 'priya.sharma@gmail.com',
      phone: '+91 9988776655',
      totalRides: 4,
      rating: 4.95,
      status: 'Active'
    });
    riderId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!riderId;
  });

  await check('Riders', 'Get & Verify Rider (/api/admin/riders)', async () => {
    const res = await request('GET', '/api/admin/riders');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((r: any) => r.id === riderId);
  });

  await check('Riders', 'Update Rider Status (/api/admin/riders/:id)', async () => {
    const res = await request('PUT', `/api/admin/riders/${riderId}`, {
      status: 'Active',
      rating: 5.0
    });
    return res.status === 200;
  });

  // 5. PAGE: DRIVERS & DUAL ROLE MANAGEMENT
  let driverId = '';
  await check('Drivers', 'Create Driver with Dual Role (/api/admin/drivers)', async () => {
    const res = await request('POST', '/api/admin/drivers', {
      name: 'Kishore Kumar Auto Driver',
      phone: '+91 9112233445',
      email: 'kishore.auto@taxiapp.in',
      vehicleType: 'Auto Rickshaw',
      vehicleNumber: 'TS07UA1234',
      vehicleModel: 'Bajaj Compact RE',
      status: 'Active',
      kycStatus: 'Verified',
      dualRole: true
    });
    driverId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!driverId;
  });

  await check('Drivers', 'Verify Driver in Fleet Listing (/api/admin/drivers)', async () => {
    const res = await request('GET', '/api/admin/drivers');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((d: any) => d.id === driverId);
  });

  await check('Drivers', 'Update Driver KYC Approval (/api/admin/drivers/:id/kyc)', async () => {
    const res = await request('PUT', `/api/admin/drivers/${driverId}/kyc`, {
      kycStatus: 'Approved',
      isVerified: true
    });
    return res.status === 200;
  });

  // 6. PAGE: TRIPS & DISPATCH BOOKINGS
  let tripId = '';
  await check('Trips', 'Create Frontend Booking (/api/trips)', async () => {
    const res = await request('POST', '/api/trips', {
      riderName: 'Priya Sharma Pune',
      riderPhone: '+91 9988776655',
      driverName: 'Kishore Kumar Auto Driver',
      driverPhone: '+91 9112233445',
      pickup: 'Kothrud Bus Stand, Pune',
      destination: 'Hinjawadi Phase 1, Pune',
      fare: 350,
      paymentMethod: 'UPI',
      status: 'Completed',
      vehicleType: 'Auto Rickshaw'
    });
    tripId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!tripId;
  });

  await check('Trips', 'Admin Audit Merges Booking (/api/admin/trips)', async () => {
    const res = await request('GET', '/api/admin/trips');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((t: any) => String(t.id) === String(tripId));
  });

  await check('Trips', 'Update Trip Status (/api/admin/trips/:id)', async () => {
    const res = await request('PUT', `/api/admin/trips/${tripId}`, {
      status: 'Completed'
    });
    return res.status === 200;
  });

  // 7. PAGE: SUPPORT TICKETS & DESK
  let ticketId = '';
  await check('Support', 'Submit Support Ticket (/api/admin/support/tickets)', async () => {
    const res = await request('POST', '/api/admin/support/tickets', {
      subject: 'Verification of zero-commission fare',
      user: 'Priya Sharma Pune',
      userRole: 'Rider',
      priority: 'High',
      status: 'Open',
      comment: 'Trip fare was settled directly with driver.'
    });
    ticketId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!ticketId;
  });

  await check('Support', 'Resolve Support Ticket (/api/admin/support/tickets/:id)', async () => {
    const res = await request('PUT', `/api/admin/support/tickets/${ticketId}`, {
      status: 'Resolved'
    });
    return res.status === 200;
  });

  // 8. PAGE: SUBSCRIBERS & MEMBERSHIP PASSES
  let subId = '';
  await check('Subscribers', 'Add Driver Subscription (/api/admin/subscribers)', async () => {
    const res = await request('POST', '/api/admin/subscribers', {
      name: 'Kishore Kumar Auto Driver',
      email: 'kishore.auto@taxiapp.in',
      plan: 'Auto Driver 30-Day Zero Comm Pass',
      planId: 'plan_auto_30',
      amountPaid: 499,
      status: 'Active'
    });
    subId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!subId;
  });

  await check('Subscribers', 'Fetch All Subscribers (/api/admin/subscribers)', async () => {
    const res = await request('GET', '/api/admin/subscribers');
    const list = Array.isArray(res.data) ? res.data : (res.data?.subscribers || []);
    return res.status === 200 && list.some((s: any) => s.id === subId);
  });

  // 9. PAGE: REVIEWS & FEEDBACK MODERATION
  let reviewId = '';
  await check('Reviews', 'Submit Commuter Review (/api/admin/reviews)', async () => {
    const res = await request('POST', '/api/admin/reviews', {
      riderName: 'Priya Sharma Pune',
      driverName: 'Kishore Kumar Auto Driver',
      rating: 5,
      comment: 'Punctual driver, direct UPI payment without any extra commission fee!',
      status: 'Active'
    });
    reviewId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!reviewId;
  });

  await check('Reviews', 'Fetch & Moderate Reviews (/api/admin/reviews)', async () => {
    const res = await request('GET', '/api/admin/reviews');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((r: any) => r.id === reviewId);
  });

  // 10. PAGE: FAQS & KNOWLEDGEBASE
  let faqId = '';
  await check('FAQs', 'Create FAQ Item (/api/admin/faqs)', async () => {
    const res = await request('POST', '/api/admin/faqs', {
      question: 'How do drivers receive 100% direct payments?',
      answer: 'Passengers pay drivers directly via UPI QR code or Cash with zero commission cuts.',
      category: 'Driver Partner'
    });
    faqId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!faqId;
  });

  await check('FAQs', 'Fetch FAQs List (/api/admin/faqs)', async () => {
    const res = await request('GET', '/api/admin/faqs');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((f: any) => f.id === faqId);
  });

  // 11. PAGE: BLOGS & CONTENT
  let blogId = '';
  await check('Blogs', 'Publish Blog Article (/api/admin/blogs)', async () => {
    const res = await request('POST', '/api/admin/blogs', {
      title: 'Zero Commission Ride Revolution in India',
      slug: 'zero-commission-ride-revolution',
      content: 'Why direct peer-to-peer driver payments are empowering auto and cab drivers.',
      author: 'TaxiApp Editorial',
      status: 'Published'
    });
    blogId = res.data?.id;
    return (res.status === 200 || res.status === 201) && !!blogId;
  });

  await check('Blogs', 'Fetch Articles List (/api/admin/blogs)', async () => {
    const res = await request('GET', '/api/admin/blogs');
    return res.status === 200 && Array.isArray(res.data) && res.data.some((b: any) => b.id === blogId);
  });

  // 12. PAGE: BANNERS & PROMOS
  await check('Banners', 'Fetch Banners List (/api/admin/banners)', async () => {
    const res = await request('GET', '/api/admin/banners');
    return res.status === 200 && typeof res.data === 'object';
  });

  // 13. PAGE: CONFIG & PLATFORM SETTINGS
  await check('Config', 'Fetch Dynamic Settings (/api/admin/config)', async () => {
    const res = await request('GET', '/api/admin/config');
    return res.status === 200 && typeof res.data === 'object';
  });

  await check('Config', 'Save & Sync Settings (/api/admin/config)', async () => {
    const res = await request('POST', '/api/admin/config', {
      appName: 'TaxiApp Mobility Network',
      currency: 'INR',
      commissionRate: 0
    });
    return res.status === 200;
  });

  // 14. TEARDOWN / CLEANUP OF TEST ARTIFACTS
  if (tripId) await request('DELETE', `/api/admin/trips/${tripId}`);
  if (riderId) await request('DELETE', `/api/admin/riders/${riderId}`);
  if (driverId) await request('DELETE', `/api/admin/drivers/${driverId}`);
  if (ticketId) await request('DELETE', `/api/admin/support/tickets/${ticketId}`);
  if (subId) await request('DELETE', `/api/admin/subscribers/${subId}`);
  if (reviewId) await request('DELETE', `/api/admin/reviews/${reviewId}`);
  if (faqId) await request('DELETE', `/api/admin/faqs/${faqId}`);
  if (blogId) await request('DELETE', `/api/admin/blogs/${blogId}`);

  console.log('\n===============================================================');
  console.log(`📊 FINAL REPORT: ${passed} PASSED, ${failed} FAILED across ALL PAGES`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runComprehensiveAudit();
