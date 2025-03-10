import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCreditCard } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your_publishable_key");

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#fff",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function PaymentForm({ selectedPackage, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Here you would typically create a payment intent on your server
      // For demo purposes, we'll simulate a successful payment
      const { error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }

      // Simulate successful payment
      setTimeout(() => {
        setProcessing(false);
        onSuccess();
      }, 1000);
    } catch (err) {
      setError("An unexpected error occurred.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-700 p-6 rounded-lg space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Package Details</h3>
          <span className="text-2xl font-bold text-white">
            ${selectedPackage.price}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-gray-300">
            <span className="font-medium">Package:</span> {selectedPackage.name}
          </p>
          <p className="text-gray-300">
            <span className="font-medium">Capacity:</span>{" "}
            {selectedPackage.capacity} students
          </p>
        </div>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FiCreditCard className="text-white text-xl" />
          <h3 className="text-lg font-medium text-white">Payment Details</h3>
        </div>
        <div className="p-4 bg-gray-800 rounded">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!stripe || processing}
          className={`flex-1 p-3 bg-green-600 text-white rounded-lg font-medium transition
            ${
              processing
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
        >
          {processing ? "Processing..." : `Pay $${selectedPackage.price}`}
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

function Classes() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    time: "",
    duration: "",
    price: "",
    capacity: 20,
    location: "",
    package: "standard",
  });

  const classTypes = [
    "Yoga",
    "HIIT",
    "Strength Training",
    "Pilates",
    "CrossFit",
  ];
  const packageOptions = [
    { name: "standard", capacity: 20, price: 0 },
    { name: "20-50", capacity: 50, price: 49.99 },
    { name: "50+", capacity: 100, price: 99.99 },
  ];

  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Morning Yoga Flow",
      type: "Yoga",
      date: "2024-03-15",
      time: "07:00",
      duration: "60",
      price: 25,
      capacity: 20,
      location: "Studio A",
      package: "standard",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "capacity" && value > 20 && formData.package === "standard")
      return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (classes.length >= 1) {
      alert(
        "You can only create one class. Upgrade to manage multiple classes."
      );
      return;
    }
    setClasses([...classes, { ...formData, id: Date.now() }]);
    setShowCreateModal(false);
  };

  const initiatePackageUpgrade = (classId, newPackage) => {
    const selectedPkg = packageOptions.find((pkg) => pkg.name === newPackage);
    if (selectedPkg.price === 0) {
      handlePackageUpdate(classId, newPackage);
      return;
    }
    setSelectedClass(classId);
    setSelectedPackage(selectedPkg);
    setShowPaymentModal(true);
  };

  const handlePackageUpdate = async (classId, newPackage) => {
    setClasses(
      classes.map((cls) =>
        cls.id === classId
          ? {
              ...cls,
              package: newPackage,
              capacity: packageOptions.find((pkg) => pkg.name === newPackage)
                .capacity,
            }
          : cls
      )
    );
  };

  const handlePaymentSuccess = () => {
    handlePackageUpdate(selectedClass, selectedPackage.name);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">My Class</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
          disabled={classes.length >= 1}
        >
          <FiPlus className="w-5 h-5 mr-2 inline" /> Create New Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-gray-800 p-6 rounded-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white">{cls.name}</h3>
            <p className="text-gray-400">
              {cls.type} - {cls.date} at {cls.time}
            </p>
            <p className="text-gray-400">Capacity: {cls.capacity} students</p>
            <div className="mt-4">
              <label className="text-gray-400 block mb-2">
                Current Package: {cls.package}
              </label>
              <select
                value={cls.package}
                onChange={(e) => initiatePackageUpgrade(cls.id, e.target.value)}
                className="w-full p-2 bg-gray-700 text-white rounded"
              >
                {packageOptions.map((pkg) => (
                  <option key={pkg.name} value={pkg.name}>
                    {pkg.name} ({pkg.capacity} students){" "}
                    {pkg.price > 0 ? `- $${pkg.price}` : "- Free"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2 mt-4">
              <button className="p-2 text-gray-400 hover:text-white">
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-red-400">
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl text-white mb-4">Create New Class</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Class Name"
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <select
                name="type"
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              >
                <option value="">Select Type</option>
                {classTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                type="time"
                name="time"
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                max="20"
                className="w-full p-2 bg-gray-700 text-white rounded"
                required
              />
              <button
                type="submit"
                className="w-full p-2 bg-violet-600 text-white rounded hover:bg-violet-700"
              >
                Create Class
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl text-white mb-6">Upgrade Package</h2>
            <Elements stripe={stripePromise}>
              <PaymentForm
                selectedPackage={selectedPackage}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setShowPaymentModal(false)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}

export default Classes;
