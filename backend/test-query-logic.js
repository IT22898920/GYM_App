// Test the query logic from getAllGyms

// Simulate admin user request with no status parameter
const testAdminNoStatus = () => {
  const req = {
    user: { role: 'admin' },
    query: { limit: 100 } // No status parameter
  };
  
  const { status } = req.query;
  console.log('🧪 Test: Admin with no status parameter');
  console.log('- Status from query:', status);
  console.log('- Status type:', typeof status);
  console.log('- Status truthy?', !!status);
  
  const query = {};
  
  // Test the logic
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'approved';
    query.isActive = true;
    console.log('❌ NON-ADMIN PATH');
  } else if (status) {
    query.status = status;
    console.log('❌ ADMIN WITH STATUS PATH');
  } else {
    console.log('✅ ADMIN WITHOUT STATUS PATH - Should get all gyms');
  }
  
  console.log('- Final query:', query);
  console.log('- Will return:', Object.keys(query).length === 0 ? 'ALL gyms' : 'FILTERED gyms');
  console.log('');
};

// Simulate admin user request with status=pending
const testAdminWithStatus = () => {
  const req = {
    user: { role: 'admin' },
    query: { status: 'pending', limit: 100 }
  };
  
  const { status } = req.query;
  console.log('🧪 Test: Admin with status=pending');
  console.log('- Status from query:', status);
  
  const query = {};
  
  // Test the logic
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'approved';
    query.isActive = true;
    console.log('❌ NON-ADMIN PATH');
  } else if (status) {
    query.status = status;
    console.log('✅ ADMIN WITH STATUS PATH');
  } else {
    console.log('❌ ADMIN WITHOUT STATUS PATH');
  }
  
  console.log('- Final query:', query);
  console.log('');
};

// Simulate non-admin user request
const testNonAdmin = () => {
  const req = {
    user: null, // No user or non-admin user
    query: { limit: 100 }
  };
  
  const { status } = req.query;
  console.log('🧪 Test: Non-admin user');
  console.log('- Status from query:', status);
  
  const query = {};
  
  // Test the logic
  if (!req.user || req.user.role !== 'admin') {
    query.status = 'approved';
    query.isActive = true;
    console.log('✅ NON-ADMIN PATH - Should get only approved active gyms');
  } else if (status) {
    query.status = status;
    console.log('❌ ADMIN WITH STATUS PATH');
  } else {
    console.log('❌ ADMIN WITHOUT STATUS PATH');
  }
  
  console.log('- Final query:', query);
  console.log('');
};

console.log('🔍 Testing getAllGyms query logic after backend fix...\n');

testAdminNoStatus();
testAdminWithStatus();
testNonAdmin();

console.log('✅ Query logic test completed!');