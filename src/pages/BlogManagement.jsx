import { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, TrashIcon, Loader2 } from 'lucide-react';
import { backendUrl } from "../App";
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import BlogForm from '../components/BlogForm';

const BlogManagement = ({token}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async (page = 1) => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/blog/admin/list?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setBlogs(data.blogs);
        setPagination(data.pagination);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [token]);

  const handlePageChange = (page) => {
    fetchBlogs(page);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/blog/delete/${selectedBlog._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Blog deleted successfully');
        fetchBlogs(pagination.currentPage);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedBlog(null);
    }
  };

  const onBlogCreated = () => {
    setIsCreateModalOpen(false);
    fetchBlogs();
  };

  const onBlogUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedBlog(null);
    fetchBlogs(pagination.currentPage);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 ">Blog Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center gap-2"
          onClick={handleCreate}
        >
          <PlusIcon size={18} />
          Create New Blog
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span className="text-gray-700 0">Loading blogs...</span>
        </div>
      ) : (
        <>
          {blogs.length === 0 ? (
            <div className="bg-gray-50  p-6 rounded-md text-center">
              <p className="text-gray-500 ">No blogs found. Create your first blog post!</p>
            </div>
          ) : (
            <div className="bg-white  shadow rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50 ">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 0 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 0 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 0 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 0 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 0 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="h-10 w-10 rounded-md object-cover mr-3" 
                          />
                          <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">{blog.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 "
                            onClick={() => handleEdit(blog)}
                          >
                            <EditIcon size={18} />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 "
                            onClick={() => handleDelete(blog)}
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <ul className="flex space-x-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page}>
                      <button
                        className={`px-3 py-1 rounded-md ${
                          pagination.currentPage === page 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200  hover:bg-gray-300  text-gray-700 0'
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Create Blog Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Blog"
      >
        <BlogForm 
          onSuccess={onBlogCreated} 
          onCancel={() => setIsCreateModalOpen(false)}
          token={token} 
        />
      </Modal>

      {/* Edit Blog Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
        }}
        title="Edit Blog"
      >
        {selectedBlog && (
          <BlogForm 
            blog={selectedBlog} 
            onSuccess={onBlogUpdated} 
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedBlog(null);
            }}
            token={token} 
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBlog(null);
        }}
        title="Delete Blog"
      >
        <div className="p-4">
          <p className="mb-4 text-gray-700 0">Are you sure you want to delete this blog post?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200  hover:bg-gray-300 text-gray-700 0 rounded-md"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedBlog(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManagement; 