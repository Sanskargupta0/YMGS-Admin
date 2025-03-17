import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Loader2, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import PropTypes from "prop-types";

const CryptoWallets = ({ token }) => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState({
    cryptoType: "",
    network: "",
    walletAddress: "",
    qrCodeImage: "",
    isActive: true
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchWallets = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        backendUrl + "/api/order/crypto-wallets",
        { headers: { token } }
      );
      
      if (response.data.success) {
        setWallets(response.data.wallets);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch crypto wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, [token]);

  const resetForm = () => {
    setFormData({
      cryptoType: "",
      network: "",
      walletAddress: "",
      qrCodeImage: "",
      isActive: true
    });
    setEditingWalletId(null);
    setPreviewImage(null);
  };

  const handleAddNewClick = () => {
    resetForm();
    setFormMode("add");
    setShowForm(true);
  };

  const handleEditClick = (wallet) => {
    setFormData({
      cryptoType: wallet.cryptoType,
      network: wallet.network,
      walletAddress: wallet.walletAddress,
      qrCodeImage: wallet.qrCodeImage,
      isActive: wallet.isActive
    });
    setEditingWalletId(wallet._id);
    setPreviewImage(wallet.qrCodeImage);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image')) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      
      // Replace this with your actual image upload API
      const response = await axios.post(
        backendUrl + "/api/upload-image/add",
        formData,
        { 
          headers: { 
            token,
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, qrCodeImage: response.data.url }));
        setPreviewImage(response.data.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.cryptoType || !formData.network || !formData.walletAddress || !formData.qrCodeImage) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      
      let response;
      
      if (formMode === "add") {
        response = await axios.post(
          backendUrl + "/api/order/crypto-wallet/add",
          formData,
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          backendUrl + "/api/order/crypto-wallet/update",
          { ...formData, walletId: editingWalletId },
          { headers: { token } }
        );
      }
      
      if (response.data.success) {
        toast.success(formMode === "add" ? "Wallet added successfully" : "Wallet updated successfully");
        fetchWallets();
        setShowForm(false);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (walletId) => {
    if (!confirm("Are you sure you want to delete this wallet?")) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/crypto-wallet/delete",
        { walletId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Wallet deleted successfully");
        fetchWallets();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Crypto Wallet Management</h1>
        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={16} /> Add New Wallet
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {formMode === "add" ? "Add New Wallet" : "Edit Wallet"}
            </h2>
            <button
              onClick={handleFormCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cryptocurrency Type*
                </label>
                <select
                  value={formData.cryptoType}
                  onChange={(e) => setFormData({ ...formData, cryptoType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select cryptocurrency</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="USDT">Tether (USDT)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">Binance Coin (BNB)</option>
                  <option value="USDC">USD Coin (USDC)</option>
                  <option value="XRP">XRP</option>
                  <option value="ADA">Cardano (ADA)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="DOGE">Dogecoin (DOGE)</option>
                </select>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Network*
                </label>
                <input
                  type="text"
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., BTC, ERC20, BEP20, TRC20"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wallet Address*
                </label>
                <input
                  type="text"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter wallet address"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  QR Code Image*
                </label>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="mt-1 flex items-center">
                      <label className="relative flex items-center justify-center w-full h-12 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                        <span className="flex items-center">
                          <Upload className="mr-2 h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {uploadingImage ? "Uploading..." : "Click to upload QR code"}
                          </span>
                        </span>
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleImageUpload}
                          accept="image/*"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.qrCodeImage}
                      onChange={(e) => setFormData({ ...formData, qrCodeImage: e.target.value })}
                      className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                      placeholder="Or enter QR code image URL"
                    />
                  </div>
                  
                  {previewImage && (
                    <div className="flex-shrink-0">
                      <img
                        src={previewImage}
                        alt="QR Code Preview"
                        className="w-32 h-32 object-contain border border-gray-200 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-span-1">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  Active
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleFormCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loading || uploadingImage}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : formMode === "add" ? (
                  "Add Wallet"
                ) : (
                  "Update Wallet"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        {loading && !showForm && (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
        
        {!loading && wallets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No crypto wallets found. Create your first wallet by clicking the "Add New Wallet" button.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crypto Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QR Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wallets.map((wallet) => (
                <tr key={wallet._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{wallet.cryptoType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{wallet.network}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {wallet.walletAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={wallet.qrCodeImage}
                      alt={`${wallet.cryptoType} QR Code`}
                      className="w-12 h-12 object-contain"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      wallet.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {wallet.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(wallet)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(wallet._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

CryptoWallets.propTypes = {
  token: PropTypes.string
};

export default CryptoWallets; 