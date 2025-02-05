// Layout.jsx
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            {/* Logo/Brand */}
            <Link to="/" className="text-xl font-bold">
              CRM System
            </Link>

            {/* Main Navigation */}
            <div className="flex space-x-6">
              {/* Public Links */}
              <Link 
                to="/form" 
                className="hover:text-blue-300 transition-colors"
              >
                Contact Form
              </Link>
              <Link 
                to="/faq" 
                className="hover:text-blue-300 transition-colors"
              >
                FAQ
              </Link>

              {/* Admin Links */}
              <div className="relative group">
                <span className="cursor-pointer hover:text-blue-300">
                  Admin
                </span>
                <div className="absolute hidden group-hover:block w-48 bg-gray-800 mt-2 py-2 rounded-md shadow-lg">
                  <Link 
                    to="/admin/login" 
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Admin Login
                  </Link>
                  <Link 
                    to="/admin/dashboard" 
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/create-user" 
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Create User
                  </Link>
                </div>
              </div>

              {/* Staff Links */}
              <div className="relative group">
                <span className="cursor-pointer hover:text-blue-300">
                  Staff
                </span>
                <div className="absolute hidden group-hover:block w-48 bg-gray-800 mt-2 py-2 rounded-md shadow-lg">
                  <Link 
                    to="/staff/login" 
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Staff Login
                  </Link>
                  <Link 
                    to="/staff/dashboard" 
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>

              {/* Chat */}
              <Link 
                to="/chat" 
                className="hover:text-blue-300 transition-colors"
              >
                Chat
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 CRM System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;