import { useEffect, useState } from 'react';
import { backendUrl, frontendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Calendar,
  Filter,
  Pencil,
  Trash2,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import PropTypes from 'prop-types';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    name: '',
    category: '',
    subCategory: '',
    hasMinOrder: false,
    hasQuantityPrice: false,
  });

  const fetchList = async () => {
    if (!token) return null;
    setLoading(true);

    try {
      const response = await axios.post(
        backendUrl + '/api/product/list',
        {
          page: currentPage,
          limit: itemsPerPage,
          ...filters,
        }
      );
      
      if (response.data.success) {
        setList(response.data.products);
        setTotalItems(response.data.pagination.total);
        setTotalPages(response.data.pagination.pages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      name: '',
      category: '',
      subCategory: '',
      hasMinOrder: false,
      hasQuantityPrice: false,
    });
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchList();
  }, [token, currentPage, itemsPerPage, filters]);

  return (
    <div className="p-4 md:p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchList}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
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
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
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
          <label className="text-sm font-medium text-gray-600">Start Date</label>
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
          <label className="text-sm font-medium text-gray-600">Product Name</label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={filters.name}
              placeholder="Search by name"
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Category</label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.category}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="">All Categories</option>
              <option value="Prescription">Prescription Medicines</option>
              <option value="OTC">Over The Counter</option>
              <option value="Healthcare">Healthcare Devices</option>
              <option value="Wellness">Wellness Products</option>
              <option value="Personal Care">Personal Care</option>
              <option value="Ayurvedic">Ayurvedic Medicines</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Sub Category</label>
          <div className="flex items-center gap-2 border rounded p-2 bg-white border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.subCategory}
              className="w-full bg-transparent text-gray-800 focus:outline-none"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subCategory: e.target.value }))
              }
            >
              <option value="">All Sub Categories</option>
              <option value="Tablets">Tablets</option>
              <option value="Capsules">Capsules</option>
              <option value="Syrups">Syrups</option>
              <option value="Injectables">Injectables</option>
              <option value="Topical">Topical Applications</option>
              <option value="Drops">Drops</option>
              <option value="Equipment">Medical Equipment</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Special Filters</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasMinOrder}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, hasMinOrder: e.target.checked }))
                }
              />
              <span className="text-sm text-gray-600">Has Min. Order</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.hasQuantityPrice}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, hasQuantityPrice: e.target.checked }))
                }
              />
              <span className="text-sm text-gray-600">Has Quantity Price</span>
            </label>
          </div>
        </div>
      </div>

      {/* Products Table */}
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
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Sub Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Min Qty
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <img className="w-12 h-12 object-cover rounded-md" src={item.image[0]} alt="" />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-800">{item.name}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-800">{item.category}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-800">{item.subCategory}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-800">
                    {item.quantityPriceList ? (
                      JSON.parse(item.quantityPriceList).map((priceItem, index) => (
                        <div key={index}>
                          {priceItem.quantity} units: {currency}{priceItem.price}
                        </div>
                      ))
                    ) : (
                      `${currency}${item.price}`
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-800">
                    {item.minOrderQuantity > 1 ? item.minOrderQuantity : '-'}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center space-x-3">
                    <button
                      onClick={() => {
                        window.open(`${frontendUrl}/product/${item._id}`, '_blank')
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {/* TODO: Implement edit */}}
                      className="p-1 text-green-600 hover:text-green-800"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">
          Showing {list.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
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
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

List.propTypes = {
  token: PropTypes.string,
};

export default List;