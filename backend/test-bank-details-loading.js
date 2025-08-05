import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testBankDetailsLoading() {
  try {
    console.log('🧪 Testing Bank Details Loading for Customer Payment...\n');

    // 1. First, get available gyms
    console.log('1. Fetching available gyms...');
    const gymsResponse = await axios.get(`${API_BASE_URL}/gyms`);
    
    if (!gymsResponse.data.success || gymsResponse.data.data.length === 0) {
      console.log('❌ No gyms found. Please create a gym first.');
      return;
    }

    const testGym = gymsResponse.data.data[0];
    console.log(`✅ Using gym: ${testGym.gymName} (ID: ${testGym._id})`);
    console.log(`   Owner: ${JSON.stringify(testGym.owner)}`);

    // 2. Test bank details loading
    console.log('\n2. Testing bank details loading...');
    
    // Extract owner ID properly - handle both object and string cases
    const owner = testGym.owner;
    const ownerId = typeof owner === 'object' ? owner._id : owner;
    
    console.log(`   Extracted owner ID: ${ownerId}`);
    
    if (!ownerId) {
      console.log('❌ No owner ID found');
      return;
    }

    // 3. Try to fetch bank details
    console.log('\n3. Fetching gym owner bank details...');
    const bankResponse = await axios.get(`${API_BASE_URL}/users/${ownerId}/bank-account`);
    
    if (bankResponse.data.success && bankResponse.data.data) {
      console.log('✅ Bank details loaded successfully!');
      console.log('   Bank Details:');
      console.log(`   - Account Holder: ${bankResponse.data.data.accountHolderName}`);
      console.log(`   - Bank: ${bankResponse.data.data.bankName}`);
      console.log(`   - Account Number: ${bankResponse.data.data.accountNumber}`);
      console.log(`   - Branch: ${bankResponse.data.data.branchName || 'N/A'}`);
    } else {
      console.log('❌ Bank details not found or empty');
      console.log(`   Response: ${JSON.stringify(bankResponse.data)}`);
    }

    console.log('\n🎉 Bank details loading test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testBankDetailsLoading();