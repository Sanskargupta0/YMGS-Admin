import { useState, useEffect } from 'react';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { backendUrl } from "../App";
import 'react-quill/dist/quill.snow.css';

const BlogForm = ({ blog, token, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    image: '',
    isPublished: true
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (blog) {
      // Initialize form data with blog data
      setFormData({
        title: blog.title || '',
        author: blog.author || '',
        content: blog.content || '',
        image: blog.image || '',
        isPublished: blog.isPublished ?? true
      });
      // Set image preview to existing blog image
      setImagePreview(blog.image || '');
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!image) return formData.image;

    const imageFormData = new FormData();
    imageFormData.append('image', image);

    try {
      const response = await fetch(`${backendUrl}/api/upload-image/add`, {
        method: 'POST',
        headers: {
          'token': token
        },
        body: imageFormData
      });

      const data = await response.json();
      
      if (data.success) {
        return data.url;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form
      if (!formData.title.trim()) {
        toast.error('Title is required');
        return;
      }
      
      if (!formData.author.trim()) {
        toast.error('Author is required');
        return;
      }
      
      if (!formData.content.trim()) {
        toast.error('Content is required');
        return;
      }
      
      if (!formData.image && !image) {
        toast.error('Image is required');
        return;
      }

      // Upload image if a new one is selected
      const imageUrl = await uploadImage();
      
      const payload = {
        ...formData,
        image: imageUrl
      };
      
      const url = blog 
        ? `${backendUrl}/api/blog/update/${blog._id}`
        : `${backendUrl}/api/blog/create`;
        
      const method = blog ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(blog ? 'Blog updated successfully' : 'Blog created successfully');
        onSuccess();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700  mb-1">
          Blog Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Enter blog title"
        />
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700  mb-1">
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 "
          placeholder="Enter author name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700  mb-1">
          Blog Image
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="w-32 h-32 border border-gray-300  rounded-md overflow-hidden flex items-center justify-center bg-gray-50 ">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-400 " size={32} />
            )}
          </div>
          <label className="cursor-pointer bg-white  py-2 px-3 border border-gray-300  rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700  hover:bg-gray-50  focus:outline-none">
            <span className="flex items-center">
              <Upload className="mr-2" size={16} />
              {blog ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700  mb-1">
          Blog Content
        </label>
        <div className=" rounded-md">
          <ReactQuill
            value={formData.content}
            onChange={handleContentChange}
            modules={quillModules}
            className="bg-white  text-gray-900 "
            style={{ height: '250px', marginBottom: '50px' }}
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300  rounded"
        />
        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900 ">
          Publish immediately
        </label>
      </div>

      <div className="flex justify-end space-x-2 pt-5">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700  rounded-md"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin mr-2" size={18} />}
          {blog ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
    </form>
  );
};

export default BlogForm; 