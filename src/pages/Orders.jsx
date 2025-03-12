import { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Calendar,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import PropTypes from 'prop-types'

const Orders = ({token}) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [filters, setFilters] = useState({
    dateRange: '',
    email: '',
    paymentType: '',
    amount: '',
    status: '',
    paymentStatus: ''
  });

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, {headers:{token}})
      if (response.data.success) {
        // Sort orders by date in descending order (latest first)
        const sortedOrders = response.data.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status', 
        {orderId, status:event.target.value}, 
        {headers:{token}}
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Status updated successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const paymentStatusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/payment-status',
        { orderId, payment: event.target.value === 'true' },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success('Payment status updated successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const handleFilter = () => {
    let filtered = [...orders];

    if (filters.dateRange) {
      const [start, end] = filters.dateRange.split(',').map(date => new Date(date));
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (filters.email) {
      filtered = filtered.filter(order => 
        order.address.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.paymentType) {
      filtered = filtered.filter(order => 
        order.paymentMethod.toLowerCase() === filters.paymentType.toLowerCase()
      );
    }

    if (filters.amount) {
      filtered = filtered.filter(order => order.amount === parseFloat(filters.amount));
    }

    if (filters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.paymentStatus) {
      filtered = filtered.filter(order => 
        order.payment === (filters.paymentStatus === 'true')
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    handleFilter();
  }, [filters]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
        <div className="flex items-center gap-4">
          <select 
            className="p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            value={ordersPerPage}
            onChange={(e) => setOrdersPerPage(Number(e.target.value))}
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
        <div className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
            onChange={(e) => setFilters(prev => ({...prev, dateRange: e.target.value}))}
          />
        </div>
        <div className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email"
            className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
            onChange={(e) => setFilters(prev => ({...prev, email: e.target.value}))}
          />
        </div>
        <div className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
            onChange={(e) => setFilters(prev => ({...prev, paymentType: e.target.value}))}
          >
            <option value="">All Payment Types</option>
            <option value="COD">COD</option>
            <option value="Manual">Manual</option>
            <option value="Razorpay">Razorpay</option>
            <option value="Stripe">Stripe</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
          >
            <option value="">All Status</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
        <div className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
            onChange={(e) => setFilters(prev => ({...prev, paymentStatus: e.target.value}))}
          >
            <option value="">All Payment Status</option>
            <option value="true">Paid</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Info</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {currentOrders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0 w-20 h-20">
                      {order.items[0]?.image && (
                        <img 
                          src={order.items[0].image} 
                          alt={order.items[0].name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.items.map((item, i) => (
                          <div key={i}>
                            {item.name} x {item.quantity}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Order Date: {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {order.address.firstName} {order.address.lastName}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">{order.address.email}</div>
                    <div className="text-gray-500 dark:text-gray-400">{order.address.phone}</div>
                    <div className="mt-2 text-gray-500 dark:text-gray-400">
                      <div>{order.address.street},</div>
                      <div>{order.address.city}, {order.address.state}</div>
                      <div>{order.address.country}, {order.address.zipcode}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{order.paymentMethod}</div>
                  {order.manualPaymentDetails && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {order.manualPaymentDetails.paymentType}
                      {order.manualPaymentDetails.paymentType === 'paypal' && (
                        <div>PayPal: {order.manualPaymentDetails.paypalEmail}</div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {currency} {order.amount}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select 
                    onChange={(e) => statusHandler(e, order._id)} 
                    value={order.status}
                    className="text-sm border rounded p-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Packing">Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  {(order.paymentMethod === 'COD' || order.paymentMethod === 'Manual') ? (
                    <select 
                      onChange={(e) => paymentStatusHandler(e, order._id)} 
                      value={order.payment.toString()}
                      className="text-sm border rounded p-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
                    >
                      <option value="false">Pending</option>
                      <option value="true">Paid</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs rounded ${
                      order.payment 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {order.payment ? 'Paid' : 'Pending'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border rounded bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

Orders.propTypes = {
  token: PropTypes.string
}

export default Orders
