import { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';

const stripePromise = loadStripe('your_publishable_key');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#fff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

function PaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'manual') {
      onSuccess({ paymentMethod: 'manual', amount });
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      onSuccess({ paymentMethod: 'card', amount });
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Payment Method</h3>
          <span className="text-2xl font-bold text-white">${amount}</span>
        </div>

        <div className="space-y-4">
          <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === 'card' ? 'bg-violet-500/20 border-violet-500' : 'bg-gray-700 border-gray-600'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center">
              <FiCreditCard className="w-5 h-5 mr-3 text-violet-400" />
              <div>
                <div className="font-medium text-white">Credit/Debit Card</div>
                <div className="text-sm text-gray-400">Pay securely with your card</div>
              </div>
            </div>
          </label>

          <label className={`block p-4 rounded-lg border cursor-pointer transition-all ${
            paymentMethod === 'manual' ? 'bg-violet-500/20 border-violet-500' : 'bg-gray-700 border-gray-600'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="manual"
              checked={paymentMethod === 'manual'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="hidden"
            />
            <div className="flex items-center">
              <FiDollarSign className="w-5 h-5 mr-3 text-violet-400" />
              <div>
                <div className="font-medium text-white">Manual Payment</div>
                <div className="text-sm text-gray-400">Pay at the front desk</div>
              </div>
            </div>
          </label>
        </div>

        {paymentMethod === 'card' && (
          <div className="mt-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={processing}
          className={`flex-1 p-3 bg-violet-600 text-white rounded-lg font-medium transition
            ${processing ? 'opacity-75 cursor-not-allowed' : 'hover:bg-violet-700'}`}
        >
          {processing ? 'Processing...' : 'Complete Payment'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 p-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Finance() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [amount, setAmount] = useState('');

  // Sample payment history data
  const [payments] = useState([
    {
      id: 1,
      member: 'John Doe',
      amount: 49.99,
      date: '2024-03-01',
      status: 'completed',
      method: 'card',
      type: 'Membership Fee'
    },
    {
      id: 2,
      member: 'Sarah Smith',
      amount: 99.99,
      date: '2024-03-02',
      status: 'pending',
      method: 'manual',
      type: 'Package Upgrade'
    },
    {
      id: 3,
      member: 'Mike Johnson',
      amount: 29.99,
      date: '2024-03-03',
      status: 'failed',
      method: 'card',
      type: 'Monthly Fee'
    }
  ]);

  const handlePaymentSuccess = (paymentDetails) => {
    console.log('Payment successful:', paymentDetails);
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setAmount('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Finance Management
          </h1>
          <p className="text-gray-400 mt-1">Track and manage payments</p>
        </div>
        {/* <button
          onClick={() => setShowPaymentModal(true)}
          className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
        >
          <FiDollarSign className="w-5 h-5 mr-2" />
          Record Payment
        </button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-green-500/10">
              <FiDollarSign className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-sm text-gray-400">This Month</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">$2,450.85</h3>
            <p className="text-gray-400 text-sm">Total Revenue</p>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-violet-500/10">
              <FiClock className="h-6 w-6 text-violet-400" />
            </div>
            <span className="text-sm text-gray-400">Pending</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">$350.00</h3>
            <p className="text-gray-400 text-sm">Outstanding Payments</p>
          </div>
        </div>

        <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <FiUser className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-sm text-gray-400">Active</span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-white">245</h3>
            <p className="text-gray-400 text-sm">Paid Members</p>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-gray-800/40 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-semibold text-white">Recent Payments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left p-4 text-gray-400 font-medium">Member</th>
                <th className="text-left p-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                <th className="text-left p-4 text-gray-400 font-medium">Method</th>
                <th className="text-left p-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{payment.member}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-white">${payment.amount}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400">{payment.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-400">{payment.type}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      {payment.method === 'card' ? (
                        <FiCreditCard className="w-4 h-4 mr-2 text-violet-400" />
                      ) : (
                        <FiDollarSign className="w-4 h-4 mr-2 text-green-400" />
                      )}
                      <span className="text-gray-400 capitalize">{payment.method}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                      payment.status === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : payment.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {payment.status === 'completed' && <FiCheckCircle className="w-4 h-4 mr-1" />}
                      {payment.status === 'pending' && <FiAlertCircle className="w-4 h-4 mr-1" />}
                      {payment.status === 'failed' && <FiXCircle className="w-4 h-4 mr-1" />}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {/* {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Record Payment</h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPayment(null);
                    setAmount('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
              </div>

              {amount && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    amount={amount}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => {
                      setShowPaymentModal(false);
                      setSelectedPayment(null);
                      setAmount('');
                    }}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
