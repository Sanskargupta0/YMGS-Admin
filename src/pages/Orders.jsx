import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Filter,
  ArrowUpDown,
  X,
  Loader2,
} from "lucide-react";
import PropTypes from "prop-types";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    email: "",
    paymentType: "",
    amount: "",
    status: "",
    paymentStatus: "",
  });

  const formatDateToIndian = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchAllOrders = async () => {
    if (!token) return null;
    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {
          page: currentPage,
          limit: ordersPerPage,
          ...filters,
        },
        { headers: { token } }
      );
      
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Status updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const paymentStatusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/payment-status",
        { orderId, payment: event.target.value === "true" },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Payment status updated successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      email: "",
      paymentType: "",
      amount: "",
      status: "",
      paymentStatus: "",
    });
    setCurrentPage(1);
  };

  const handleFilter = () => {
    let filtered = [...orders];

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59); // Set end date to end of day

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (filters.email) {
      filtered = filtered.filter((order) =>
        order.address.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.paymentType) {
      filtered = filtered.filter(
        (order) =>
          order.paymentMethod.toLowerCase() ===
          filters.paymentType.toLowerCase()
      );
    }

    if (filters.amount) {
      filtered = filtered.filter(
        (order) => order.amount === parseFloat(filters.amount)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (order) => order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(
        (order) => order.payment === (filters.paymentStatus === "true")
      );
    }

    setOrders(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token, currentPage, ordersPerPage, filters]);

  useEffect(() => {
    handleFilter();
  }, [filters]);

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAllOrders}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md flex items-center gap-2 transition-colors"
          >
            <X size={16} />
            Clear Filters
          </button>
          <select
            className="p-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={ordersPerPage}
            onChange={(e) => {
              setOrdersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Start Date
          </label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={filters.startDate}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">End Date</label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={filters.endDate}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, endDate: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Search Email
          </label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filters.email}
              placeholder="Search by email"
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Payment Type
          </label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.paymentType}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, paymentType: e.target.value }))
              }
            >
              <option value="">All Payment Types</option>
              <option value="COD">COD</option>
              <option value="Manual">Manual</option>
              <option value="Razorpay">Razorpay</option>
              <option value="Stripe">Stripe</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Order Status
          </label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={filters.status}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All Status</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Payment Status
          </label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.paymentStatus}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentStatus: e.target.value,
                }))
              }
            >
              <option value="">All Payment Status</option>
              <option value="true">Paid</option>
              <option value="false">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer Info
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 w-20 h-20">
                      {order.items[0]?.image && (
                        <img
                          src={order.items[0].image}
                          alt={order.items[0].name}
                          className="w-full h-full object-cover rounded-md shadow-sm"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Order Date: {formatDateToIndian(order.date)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </div>
                    <div className="text-gray-600">{order.address.email}</div>
                    <div className="text-gray-600">{order.address.phone}</div>
                    <div className="mt-2 text-gray-600">
                      <div>{order.address.street},</div>
                      <div>
                        {order.address.city}, {order.address.state}
                      </div>
                      <div>
                        {order.address.country}, {order.address.zipcode}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-800">
                    {order.paymentMethod}
                  </div>
                  {order.manualPaymentDetails && (
                    <div className="text-xs text-gray-600 mt-1">
                      {order.manualPaymentDetails.paymentType}
                      {order.manualPaymentDetails.paymentType === "paypal" && (
                        <div className="mt-1">
                          PayPal: {order.manualPaymentDetails.paypalEmail}
                        </div>
                      )}
                      {order.manualPaymentDetails.paymentType === "crypto" && (
                        <div className="mt-1">
                          Crypto Transaction Id: {order.manualPaymentDetails.cryptoTransactionId}
                        </div>
                      )}
                      {order.manualPaymentDetails.paymentType ===
                        "credit_card" && (
                          <>
                        <div className="mt-1">
                          Credit Card Number: {order.manualPaymentDetails.cardNumber}
                        </div>
                        <div className="mt-1">
                          Card Holder Name: {order.manualPaymentDetails.cardHolderName}
                        </div>
                        <div className="mt-1">
                          Expiry Date: {order.manualPaymentDetails.expiryDate}
                        </div>
                        <div className="mt-1">
                          CVV: {order.manualPaymentDetails.cvv}
                        </div>
                        </>
                      )}
                      {order.manualPaymentDetails.paymentType ===
                        "debit_card" && (
                          <>
                        <div className="mt-1">
                          Debit Card Number: {order.manualPaymentDetails.cardNumber}
                        </div>
                        <div className="mt-1">
                          Card Holder Name: {order.manualPaymentDetails.cardHolderName}
                        </div>
                        <div className="mt-1">
                          Expiry Date: {order.manualPaymentDetails.expiryDate}
                        </div>
                        <div className="mt-1">
                          CVV: {order.manualPaymentDetails.cvv}
                        </div>
                        </>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-800">
                    {currency} {order.amount}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    onChange={(e) => statusHandler(e, order._id)}
                    value={order.status}
                    className="text-sm border rounded p-1.5 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  {order.paymentMethod === "COD" ||
                  order.paymentMethod === "Manual" ? (
                    <select
                      onChange={(e) => paymentStatusHandler(e, order._id)}
                      value={order.payment.toString()}
                      className="text-sm border rounded p-1.5 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="false">Pending</option>
                      <option value="true">Paid</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded ${
                        order.payment
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.payment ? "Paid" : "Pending"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {orders.length > 0 ? (currentPage - 1) * ordersPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * ordersPerPage, totalOrders)} of{" "}
          {totalOrders} orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="p-2 border rounded bg-white hover:bg-gray-50 border-gray-300 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || loading}
            className="p-2 border rounded bg-white hover:bg-gray-50 border-gray-300 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

Orders.propTypes = {
  token: PropTypes.string,
};

export default Orders;
