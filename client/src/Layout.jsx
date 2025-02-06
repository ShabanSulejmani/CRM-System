// Layout.jsx
import { Link, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <div className="flex flex-col">
            {/* Logo/Brand */}
            <h1 className="text-2xl font-bold mb-4">Customer</h1>

            {/* Main Navigation */}
            <div className="flex flex-col space-y-6">
              {/* Public Links */}
              <div className="flex flex-col space-y-2">
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
              </div>

              {/* Admin Links */}
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-semibold">Admin Pages</h2>
                <Link 
                  to="/admin/login" 
                  className="hover:text-blue-300 transition-colors pl-4"
                >
                  Admin Login
                </Link>
                <Link 
                  to="/admin/dashboard" 
                  className="hover:text-blue-300 transition-colors pl-4"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/create-user" 
                  className="hover:text-blue-300 transition-colors pl-4"
                >
                  Create User
                </Link>
              </div>

              {/* Staff Links */}
              <div className="flex flex-col space-y-2">
                <h2 className="text-xl font-semibold">Staff</h2>
                <Link 
                  to="/staff/login" 
                  className="hover:text-blue-300 transition-colors pl-4"
                >
                  Staff Login
                </Link>
                <Link 
                  to="/staff/dashboard" 
                  className="hover:text-blue-300 transition-colors pl-4"
                >
                  Dashboard
                </Link>
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
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; { new Date().getFullYear()} All rights reversed</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;