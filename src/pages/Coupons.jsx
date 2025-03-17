import { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Loader2, Plus, Pencil, Trash2, X } from "lucide-react";
import PropTypes from "prop-types";

const Coupons = ({ token }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add"); // "add" or "edit"
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "0",
    maxUses: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true
  });
  const [editingCouponId, setEditingCouponId] = useState(null);

  const fetchCoupons = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(
        backendUrl + "/api/order/coupons",
        { headers: { token } }
      );
      
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [token]);

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "0",
      maxUses: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true
    });
    setEditingCouponId(null);
  };

  const handleAddNewClick = () => {
    resetForm();
    setFormMode("add");
    setShowForm(true);
  };

  const handleEditClick = (coupon) => {
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderValue: coupon.minOrderValue.toString(),
      maxUses: coupon.maxUses ? coupon.maxUses.toString() : "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      isActive: coupon.isActive
    });
    setEditingCouponId(coupon._id);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.code) {
      toast.error("Coupon code is required");
      return;
    }
    
    if (!formData.discountValue || isNaN(formData.discountValue) || parseFloat(formData.discountValue) <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }
    
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderValue: parseFloat(formData.minOrderValue) || 0,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null
      };
      
      let response;
      
      if (formMode === "add") {
        response = await axios.post(
          backendUrl + "/api/order/coupon/add",
          payload,
          { headers: { token } }
        );
      } else {
        response = await axios.post(
          backendUrl + "/api/order/coupon/update",
          { ...payload, couponId: editingCouponId },
          { headers: { token } }
        );
      }
      
      if (response.data.success) {
        toast.success(formMode === "add" ? "Coupon added successfully" : "Coupon updated successfully");
        fetchCoupons();
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

  const handleDeleteClick = async (couponId) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    try {
      setLoading(true);
      const response = await axios.post(
        backendUrl + "/api/order/coupon/delete",
        { couponId },
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Coupon deleted successfully");
        fetchCoupons();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete coupon");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          disabled={loading}
        >
          <Plus size={16} /> Add New Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {formMode === "add" ? "Add New Coupon" : "Edit Coupon"}
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
                  Coupon Code*
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., SUMMER2023"
                  readOnly={formMode === "edit"}
                  required
                />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type*
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.discountType === "percentage" ? "Discount Percentage*" : "Discount Amount*"}
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder={formData.discountType === "percentage" ? "e.g., 10" : "e.g., 5.99"}
                  min="0"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  required
                />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Value
                </label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 50"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Uses (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 100"
                  min="1"
                  step="1"
                />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (leave empty for no expiry)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
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
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : formMode === "add" ? (
                  "Add Coupon"
                ) : (
                  "Update Coupon"
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
        
        {!loading && coupons.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No coupons found. Create your first coupon by clicking the "Add New Coupon" button.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
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
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.minOrderValue > 0 ? `$${coupon.minOrderValue.toFixed(2)}` : "None"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {coupon.usedCount} used
                      {coupon.maxUses ? ` / ${coupon.maxUses} max` : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(coupon)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(coupon._id)}
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

Coupons.propTypes = {
  token: PropTypes.string
};

export default Coupons; 