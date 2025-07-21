import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { gymService, formatGymDataForAPI } from '../services/gymService';
import { FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';

function TestGymRegistration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [gymInfo, setGymInfo] = useState(null);

  // Test accounts
  const testCustomer = {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'testcustomer@example.com',
    password: 'password123',
    role: 'customer'
  };

  const testAdmin = {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };

  // Test gym data
  const testGymData = {
    gymName: 'Test Fitness Center',
    gymType: 'Fitness Center',
    description: 'A test gym for registration',
    email: 'testgym@example.com',
    phone: '+94 77 123 4567',
    address: '123 Test Street',
    city: 'Colombo',
    state: 'Western Province',
    zipCode: '00700',
    location: { lat: 6.9271, lng: 79.8612 },
    facilities: ['Weight Machines', 'Cardio Equipment', 'Locker Rooms'],
    classTypes: ['Yoga', 'CrossFit', 'Personal Training'],
    membershipPlans: [
      { name: 'Basic', duration: '1 month', price: '5000', description: 'Basic access' }
    ],
    termsAccepted: true,
    privacyAccepted: true
  };

  // Step 1: Register Customer
  const registerCustomer = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.register(testCustomer);
      setUserInfo(response.user);
      setMessage(`✅ Customer registered successfully! Email: ${testCustomer.email}`);
      setStep(2);
    } catch (err) {
      if (err.message.includes('already exists')) {
        setMessage('ℹ️ Customer already exists, proceeding to login...');
        setStep(2);
      } else {
        setError(`❌ Registration failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Login as Customer
  const loginCustomer = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.login({
        email: testCustomer.email,
        password: testCustomer.password,
        role: 'customer'
      });
      setUserInfo(response.user);
      setMessage(`✅ Logged in as customer! Token stored.`);
      setStep(3);
    } catch (err) {
      setError(`❌ Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register Gym
  const registerGym = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const apiData = formatGymDataForAPI(testGymData);
      const response = await gymService.registerGym(apiData);
      setGymInfo(response.data);
      setMessage(`✅ Gym registered successfully! ID: ${response.data._id}`);
      setStep(4);
    } catch (err) {
      setError(`❌ Gym registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Login as Admin
  const loginAdmin = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // First logout current user
      await api.logout();
      
      // Login as admin
      const response = await api.login({
        email: testAdmin.email,
        password: testAdmin.password,
        role: 'admin'
      });
      setMessage(`✅ Logged in as admin!`);
      setStep(5);
    } catch (err) {
      setError(`❌ Admin login failed: ${err.message}. You may need to create an admin account first.`);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Approve Gym
  const approveGym = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await gymService.admin.approveGym(gymInfo._id, 'Approved for testing');
      setMessage(`✅ Gym approved! The customer should now be a gym owner.`);
      setStep(6);
    } catch (err) {
      setError(`❌ Gym approval failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Register Customer Account</h3>
            <p className="text-gray-400">Create a new customer account for testing</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300">Email: {testCustomer.email}</p>
              <p className="text-sm text-gray-300">Password: {testCustomer.password}</p>
            </div>
            <button
              onClick={registerCustomer}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'Register Customer'}
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Login as Customer</h3>
            <p className="text-gray-400">Login with the customer account</p>
            {userInfo && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-300">User: {userInfo.firstName} {userInfo.lastName}</p>
                <p className="text-sm text-gray-300">Role: {userInfo.role}</p>
              </div>
            )}
            <button
              onClick={loginCustomer}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'Login as Customer'}
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Register Gym</h3>
            <p className="text-gray-400">Register a gym as the logged-in customer</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-300">Gym Name: {testGymData.gymName}</p>
              <p className="text-sm text-gray-300">Location: {testGymData.city}</p>
            </div>
            <button
              onClick={registerGym}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'Register Gym'}
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 4: Switch to Admin</h3>
            <p className="text-gray-400">Login as admin to approve the gym</p>
            {gymInfo && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-300">Gym ID: {gymInfo._id}</p>
                <p className="text-sm text-gray-300">Status: {gymInfo.status}</p>
              </div>
            )}
            <button
              onClick={loginAdmin}
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'Login as Admin'}
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 5: Approve Gym</h3>
            <p className="text-gray-400">Approve the gym and update customer role to gymOwner</p>
            <button
              onClick={approveGym}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <FiLoader className="animate-spin" /> : 'Approve Gym'}
            </button>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">✅ Test Complete!</h3>
            <p className="text-gray-400">The gym registration flow has been tested successfully.</p>
            <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
              <p className="text-green-400">The customer has been upgraded to gym owner!</p>
              <p className="text-sm text-gray-400 mt-2">You can now login with the customer credentials and access the gym owner dashboard.</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gym Registration Test Flow</h1>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className={`flex items-center ${num < 6 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  num <= step ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                {num < step ? <FiCheck /> : num}
              </div>
              {num < 6 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    num < step ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500 rounded-lg flex items-start">
            <FiCheck className="text-green-400 mt-1 mr-3" />
            <p className="text-green-400">{message}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg flex items-start">
            <FiAlertCircle className="text-red-400 mt-1 mr-3" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          {getStepContent()}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800/30 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>First, make sure your backend server is running on port 5000</li>
            <li>This test will create a customer account and register a gym</li>
            <li>You'll need admin credentials to approve the gym</li>
            <li>After approval, the customer will be upgraded to gym owner</li>
            <li>All test data uses example.com emails</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default TestGymRegistration;