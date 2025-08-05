import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiEdit3,
  FiTrash2,
  FiSave,
  FiX,
  FiHome,
  FiGlobe,
  FiArrowLeft,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../../utils/api";
import { useAlert } from "../../contexts/AlertContext";

function BankAccount() {
  console.log("🎯 BankAccount component is rendering/re-rendering");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bankAccount, setBankAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    swiftCode: "",
    iban: "",
    currency: "LKR",
    accountType: "business",
  });
  const [gymId, setGymId] = useState(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    console.log("🚀 useEffect called - about to call fetchGymAndBankAccount");
    fetchGymAndBankAccount();
  }, []);

  const fetchGymAndBankAccount = async () => {
    console.log("=== fetchGymAndBankAccount function called ===");
    try {
      console.log("Setting isLoading to true...");
      setIsLoading(true);
      
      // Fetch user's bank account details directly (user-based, not gym-based)
      try {
        console.log("About to make API call to /users/bank-account");
        console.log("API instance:", api);
        console.log("API base URL:", api.baseURL);
        console.log("Full URL will be:", `${api.baseURL}/users/bank-account`);
        const bankResponse = await api.get("/users/bank-account");
        console.log("Bank account response:", bankResponse);
        console.log("Response success:", bankResponse.success);
        console.log("Response data:", bankResponse.data);
        
        if (bankResponse.success) {
          // The bank account data is directly in response.data
          let bankData = bankResponse.data;
          
          // If the data contains a bankAccount property, use that (from PUT response)
          if (bankData && bankData.bankAccount) {
            bankData = bankData.bankAccount;
          }
          
          if (bankData) {
            console.log("Bank account data found:", bankData);
            console.log("About to set bankAccount state with:", bankData);
            setBankAccount(bankData);
            console.log("Bank account state should now be set");
            // Store the original account number for editing (we'll need to get it from backend when editing)
            setFormData({
              accountHolderName: bankData.accountHolderName || "",
              accountNumber: "", // Don't prefill masked number
              bankName: bankData.bankName || "",
              branchName: bankData.branchName || "",
              swiftCode: bankData.swiftCode || "",
              iban: bankData.iban || "",
              currency: bankData.currency || "LKR",
              accountType: bankData.accountType || "business",
            });
            console.log("Bank account data loaded successfully");
          } else {
            console.log("No bank account data found - user needs to add bank account");
            setBankAccount(null);
          }
        } else {
          console.log("API call failed:", bankResponse);
        }
      } catch (error) {
        // Bank account not found is okay, user can add one
        console.error("=== ERROR in fetchGymAndBankAccount ===");
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", error);
        setBankAccount(null);
      }

      // Set gymId to indicate this is now user-based
      setGymId("user-based");
      
      // Clean up any old localStorage data since we now store in user profile
      if (localStorage.getItem('pendingBankAccount')) {
        localStorage.removeItem('pendingBankAccount');
      }
      
    } catch (error) {
      console.error("=== OUTER ERROR in fetchGymAndBankAccount ===");
      console.error("Outer error message:", error.message);
      console.error("Outer error stack:", error.stack);
      console.error("Outer full error object:", error);
      showAlert("error", "Failed to fetch bank account data");
    } finally {
      console.log("Setting isLoading to false...");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.accountHolderName || !formData.accountNumber || !formData.bankName) {
        showAlert("error", "Please fill in all required fields");
        return;
      }

      // Clean up formData - remove empty optional fields
      const cleanedFormData = { ...formData };
      
      // Remove empty optional fields to avoid validation errors
      if (!cleanedFormData.branchName?.trim()) {
        delete cleanedFormData.branchName;
      }
      if (!cleanedFormData.swiftCode?.trim()) {
        delete cleanedFormData.swiftCode;
      }
      if (!cleanedFormData.iban?.trim()) {
        delete cleanedFormData.iban;
      }

      // Save bank account details to user profile
      const response = await api.put("/users/bank-account", cleanedFormData);
      
      if (response.success) {
        console.log("Save response:", response);
        // The response contains the full user data with bankAccount nested inside
        const updatedBankAccount = response.data.bankAccount;
        console.log("Setting bank account data:", updatedBankAccount);
        setBankAccount(updatedBankAccount);
        setIsEditing(false);
        showAlert("success", "Bank account details saved successfully");
        // Don't call fetchGymAndBankAccount() since we already have the updated data
        // This prevents the state from being overridden
      }
    } catch (error) {
      console.error("Error saving bank account:", error);
      showAlert("error", error.response?.data?.message || "Failed to save bank account details");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your bank account details?")) {
      return;
    }

    try {
      // Delete bank account details from user profile
      const response = await api.delete("/users/bank-account");
      
      if (response.success) {
        setBankAccount(null);
        setFormData({
          accountHolderName: "",
          accountNumber: "",
          bankName: "",
          branchName: "",
          swiftCode: "",
          iban: "",
          currency: "LKR",
          accountType: "business",
        });
        showAlert("success", "Bank account details deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      showAlert("error", "Failed to delete bank account details");
    }
  };

  const handleEdit = async () => {
    try {
      // Fetch full bank account details for editing
      const response = await api.get("/users/bank-account/edit");
      if (response.success && response.data) {
        setFormData({
          accountHolderName: response.data.accountHolderName || "",
          accountNumber: response.data.accountNumber || "",
          bankName: response.data.bankName || "",
          branchName: response.data.branchName || "",
          swiftCode: response.data.swiftCode || "",
          iban: response.data.iban || "",
          currency: response.data.currency || "LKR",
          accountType: response.data.accountType || "business",
        });
      }
      setIsEditing(true);
    } catch (error) {
      console.error("Error loading bank account for edit:", error);
      showAlert("error", "Failed to load bank account details for editing");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to saved values (masked)
    if (bankAccount) {
      setFormData({
        accountHolderName: bankAccount.accountHolderName || "",
        accountNumber: "", // Don't show masked number
        bankName: bankAccount.bankName || "",
        branchName: bankAccount.branchName || "",
        swiftCode: bankAccount.swiftCode || "",
        iban: bankAccount.iban || "",
        currency: bankAccount.currency || "LKR",
        accountType: bankAccount.accountType || "business",
      });
    }
  };

  // Debug logging - removed to prevent render loops

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  // This condition is removed - we now allow bank account management even without a gym

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Bank Account Details
          </h1>
          <p className="text-gray-400 mt-1">Manage your payment information</p>
        </div>
        <Link
          to="/gym-owner/dashboard"
          className="inline-flex items-center px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <FiGlobe className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-1">Personal Bank Account</h3>
            <p className="text-sm text-gray-300">
              These are your personal bank account details as a gym owner. 
              These details will be used for all transactions related to your gym business.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        {!isEditing && bankAccount ? (
          // View Mode
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-violet-500/10 rounded-lg mr-4">
                  <FiCreditCard className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Bank Account Information</h2>
                  <p className="text-gray-400 text-sm">
                    {bankAccount.isVerified ? (
                      <span className="flex items-center text-green-400">
                        <FiCheckCircle className="mr-1" /> Verified
                      </span>
                    ) : (
                      "Pending Verification"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center"
                >
                  <FiEdit3 className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Holder Name</label>
                <p className="text-white text-lg">{bankAccount.accountHolderName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Number</label>
                <p className="text-white text-lg font-mono">{bankAccount.accountNumber}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bank Name</label>
                <p className="text-white text-lg">{bankAccount.bankName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Branch Name</label>
                <p className="text-white text-lg">{bankAccount.branchName || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">SWIFT Code</label>
                <p className="text-white text-lg font-mono">{bankAccount.swiftCode || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">IBAN</label>
                <p className="text-white text-lg font-mono">{bankAccount.iban || "-"}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                <p className="text-white text-lg">{bankAccount.currency}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Type</label>
                <p className="text-white text-lg capitalize">{bankAccount.accountType}</p>
              </div>
            </div>

            {bankAccount.lastUpdated && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Last updated: {new Date(bankAccount.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          // Edit/Add Mode
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-violet-500/10 rounded-lg mr-4">
                  <FiHome className="h-6 w-6 text-violet-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  {bankAccount ? "Edit Bank Account" : "Add Bank Account"}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Holder Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="Enter account holder name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors font-mono"
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bank Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors"
                  placeholder="Enter branch name (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">SWIFT Code</label>
                <input
                  type="text"
                  name="swiftCode"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors font-mono"
                  placeholder="Enter SWIFT code (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">IBAN</label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors font-mono"
                  placeholder="Enter IBAN (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors"
                >
                  <option value="LKR">LKR - Sri Lankan Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-violet-500 focus:outline-none transition-colors"
                >
                  <option value="business">Business</option>
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-700">
              {bankAccount && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
                >
                  <FiX className="mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Details
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <FiGlobe className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Security Notice</h3>
            <p className="text-sm text-gray-300">
              Your bank account information is encrypted and stored securely. We only display masked account numbers for your protection. 
              This information will be used solely for processing payments related to your gym business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BankAccount;