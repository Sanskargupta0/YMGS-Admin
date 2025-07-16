# [YMGS Pharmacy Admin Dashboard](https://ymgs-admin.vercel.app/) &middot; [![Author Sanskar Gupta](https://img.shields.io/badge/Author-Sanskar-%3C%3E)](https://www.linkedin.com/in/sanskar-gupta-12476423b/)  
[![GitHub](https://img.shields.io/badge/GitHub-%3C%3E)](https://github.com/Sanskargupta0/YMGS-Admin)  
[![React](https://img.shields.io/badge/React-%3C%3E)](https://react.dev/)  
[![Vite](https://img.shields.io/badge/Vite-%3C%3E)](https://vitejs.dev/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%3C%3E)](https://tailwindcss.com/)

## 📝 Project Description

YMGS Pharmacy Admin Dashboard is a comprehensive administrative panel built with React and Vite for managing an online pharmacy platform. This powerful admin interface provides complete control over product inventory, order management, customer communications, promotional campaigns, and site settings. The dashboard seamlessly integrates with the YMGS Frontend and Backend to provide a complete e-commerce pharmacy solution with features like product management, order tracking, coupon management, cryptocurrency payment wallets, blog management, and customer support.

## ⚙️ Tech Stack

- **Frontend Framework**: React 18, Vite 6
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Lucide React icons
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **Rich Text Editor**: React Quill
- **Notifications**: React Toastify
- **Date Utilities**: date-fns
- **Build Tool**: Vite with React plugin
- **Deployment**: Vercel

## 🔋 Features

👉 **Secure Admin Authentication**: Protected login system with token-based authentication and persistent sessions across browser refreshes.

👉 **Product Management**: 
- Add new pharmacy products with multiple image uploads
- Edit existing products with real-time preview
- Bulk quantity pricing for wholesale orders
- Category and subcategory organization
- Bestseller tagging and inventory control

👉 **Advanced Order Management**: 
- Real-time order tracking with comprehensive filtering
- Order status updates and payment verification
- Customer order history and detailed analytics
- Export capabilities for order reports

👉 **Customer Communication Hub**: 
- Contact form submissions management
- Customer inquiry tracking and response system
- Detailed customer interaction history

👉 **Promotional Tools**: 
- Dynamic coupon creation and management
- Percentage and fixed amount discount options
- Usage limits and validity period controls
- Minimum order value requirements

👉 **Cryptocurrency Payment Integration**: 
- Multiple crypto wallet management (Bitcoin, Ethereum, etc.)
- QR code generation for crypto payments
- Network-specific wallet addresses
- Real-time wallet status monitoring

👉 **Content Management System**: 
- Rich text blog editor with image uploads
- Blog post scheduling and publishing
- SEO-friendly content management
- Author attribution and categorization

👉 **Site Configuration**: 
- Global site settings management
- Contact information updates
- Business hours configuration
- Footer content management

👉 **Responsive Design**: Modern, mobile-first design that works seamlessly across desktop, tablet, and mobile devices with intuitive navigation.

👉 **Real-time Notifications**: Toast notifications for all admin actions with success, error, and warning states for better user experience.

## 🏗️ System Architecture

### Integration with YMGS Ecosystem

This admin dashboard is part of a three-tier architecture:

1. **[YMGS Frontend](https://github.com/Sanskargupta0/YMGS-Frontend)**: Customer-facing e-commerce platform
2. **[YMGS Backend](https://github.com/Sanskargupta0/YMGS-Backend)**: API server and business logic
3. **YMGS Admin Dashboard**: Administrative interface (this repository)

### Core Workflows

1. **Product Management Flow**:
   - Admin adds/edits products through intuitive forms
   - Multiple image uploads with preview functionality
   - Real-time inventory and pricing updates
   - Changes reflect immediately on the frontend

2. **Order Processing Workflow**:
   - Orders from frontend appear in real-time
   - Advanced filtering and sorting capabilities
   - Status updates sync across all platforms
   - Payment verification and tracking

3. **Content Management Flow**:
   - Blog creation with rich text editor
   - Image upload and management
   - SEO optimization tools
   - Publishing workflow with scheduling

## 🚀 Quick Start

Follow these steps to set up the admin dashboard locally on your machine.

### Prerequisites

Make sure you have the following installed:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (version 18.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Cloning the Repository

```bash
git clone https://github.com/Sanskargupta0/YMGS-Admin.git
cd YMGS-Admin
```

### Installation

Install dependencies using npm:

```bash
npm install
```

### Environment Setup

1. Create a `.env` file in the root directory by copying from `.env.example`:

```bash
cp .env.example .env
```

2. Fill in the required environment variables in your `.env` file:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
```

### Backend Setup

Before running the admin dashboard, ensure the backend server is running:

1. Clone and set up the [YMGS Backend](https://github.com/Sanskargupta0/YMGS-Backend)
2. Follow the backend setup instructions
3. Start the backend server on port 4000

### Running the Application

1. **Start the development server**:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5174`

3. **Login with test credentials**:
   - Email: `admin@gmail.com`
   - Password: `admin123`

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

### Backend Integration
- `VITE_BACKEND_URL`: URL of the YMGS Backend API server (default: `http://localhost:4000`)

### Frontend Integration  
- `VITE_FRONTEND_URL`: URL of the YMGS Frontend application (default: `http://localhost:5173`)

## 🎯 Usage Guide

### Accessing the Admin Dashboard

1. **Authentication**: Use the provided test credentials or set up your own admin account
2. **Dashboard Navigation**: Use the sidebar to navigate between different management sections
3. **Responsive Design**: Access from any device - the interface adapts to screen size

### Key Management Areas

#### Product Management
- **Add Products**: Navigate to "Add Items" to create new products
- **Manage Inventory**: Use "Link Items" to view and edit existing products
- **Bulk Operations**: Support for quantity-based pricing and bulk updates

#### Order Management
- **Order Tracking**: Default landing page shows all orders with filtering options
- **Status Updates**: Update order status and track payment confirmations
- **Customer Communication**: Direct access to customer order details

#### Content Management
- **Blog Creation**: Rich text editor for creating pharmacy-related content
- **Media Management**: Upload and manage images for products and blogs
- **SEO Optimization**: Built-in tools for search engine optimization

#### System Administration
- **Site Settings**: Update global site configuration
- **Coupon Management**: Create and manage promotional campaigns
- **Crypto Wallets**: Configure cryptocurrency payment options

## 🏗️ Project Structure

```
ymgs-admin/
├── public/                       # Static assets
│   └── vite.svg                 # Vite logo
├── src/                         # Source code
│   ├── assets/                  # Local assets
│   │   ├── assets.js           # Asset exports
│   │   ├── image1.png          # Product images
│   │   ├── logo.png            # YMGS logo
│   │   └── upload_area.png     # Upload placeholder
│   ├── components/              # Reusable components
│   │   ├── BlogForm.jsx        # Rich text blog editor
│   │   ├── Login.jsx           # Authentication component
│   │   ├── Modal.jsx           # Modal wrapper component
│   │   ├── Navbar.jsx          # Top navigation
│   │   └── Sidebar.jsx         # Sidebar navigation
│   ├── pages/                   # Main application pages
│   │   ├── Add.jsx             # Product creation/editing
│   │   ├── BlogManagement.jsx  # Blog management
│   │   ├── Contacts.jsx        # Customer communications
│   │   ├── Coupons.jsx         # Promotional management
│   │   ├── CryptoWallets.jsx   # Crypto payment setup
│   │   ├── List.jsx            # Product inventory
│   │   ├── Orders.jsx          # Order management
│   │   └── SiteSettings.jsx    # Global settings
│   ├── App.jsx                  # Main application component
│   ├── index.css               # Global styles
│   └── main.jsx                # Application entry point
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── README.md                   # Project documentation
├── vercel.json                 # Vercel deployment config
└── vite.config.js              # Vite configuration
```

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌐 Integration Guide

### Connecting to YMGS Ecosystem

1. **Backend Integration**:
   - Ensure YMGS Backend is running on the configured port
   - Update `VITE_BACKEND_URL` in `.env` to match backend URL
   - Verify API endpoints are accessible

2. **Frontend Integration**:
   - Set `VITE_FRONTEND_URL` to match the customer-facing application
   - Ensure consistent product data across platforms
   - Test order flow from frontend to admin dashboard

3. **Production Deployment**:
   - Update environment variables for production URLs
   - Configure CORS settings on backend for admin domain
   - Set up proper authentication tokens

## 🔒 Security Features

- **Token-based Authentication**: Secure JWT token system with automatic expiration
- **Protected Routes**: All admin routes require valid authentication
- **Input Validation**: Client-side and server-side validation for all forms
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Environment Variables**: Sensitive configuration kept in environment files

## 🚦 Troubleshooting

### Common Issues

1. **Login Issues**: 
   - Verify backend server is running
   - Check API endpoints in browser network tab
   - Ensure correct admin credentials

2. **Image Upload Problems**:
   - Check file size limits
   - Verify supported image formats
   - Ensure backend storage is configured

3. **Environment Variables**:
   - Restart development server after `.env` changes
   - Use `VITE_` prefix for all environment variables
   - Check for typos in variable names

4. **API Connection Issues**:
   - Verify backend URL in environment variables
   - Check CORS settings on backend server
   - Ensure network connectivity

### Performance Tips

- Optimize images before uploading for better load times
- Use pagination for large datasets (orders, products)
- Clear browser cache if experiencing stale data issues
- Monitor network requests for API optimization opportunities

## 📸 Screenshots

### Login Page
![Login Page](/screenshots/login-page.png)

### Dashboard Overview
![Dashboard](/screenshots/dashboard.png)

### Product Management
![Product Management](/screenshots/product-management.png)

### Order Management
![Order Management](/screenshots/order-management.png)

### Blog Management
![Blog Management](/screenshots/blog-management.png)

### Coupon Management
![Coupon Management](/screenshots/coupon-management.png)

### Contact Management
![Coupon Management](/screenshots/contact-management.png)

### Crypto Wallets
![Crypto Wallets](/screenshots/crypto-wallets.png)

### Site Settings
![Site Settings](/screenshots/site-settings.png)

## 🔗 Related Repositories

- **Frontend**: [YMGS-Frontend](https://github.com/Sanskargupta0/YMGS-Frontend) - Customer-facing e-commerce platform
- **Backend**: [YMGS-Backend](https://github.com/Sanskargupta0/YMGS-Backend) - API server and business logic
- **Live Demo**: [YMGS Admin Dashboard](https://ymgs-admin.vercel.app/)

## 🧪 Test Credentials

For testing the admin dashboard, use these credentials:

- **Email**: `admin@gmail.com`
- **Password**: `admin123`

*Note: These are demo credentials for development and testing purposes only.*

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review environment variable configuration
3. Ensure all related services (frontend/backend) are running
4. Check browser console for detailed error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by [Sanskar Gupta](https://www.linkedin.com/in/sanskar-gupta-12476423b/)
