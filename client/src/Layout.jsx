// Layout.jsx
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      {/* Navigation Header */}
      <nav>
        <div>
          <div>
            {/* Logo/Brand */}
            <h1>Customer</h1>

            {/* Main Navigation */}
            <div>
              {/* Public NavLinks */}
              <div>
             
                <NavLink 
                  to={"/dynamisk"}
                  className="hover:text-blue-300 transition-colors"
                >
                  Dynamiskt Formulär
                </NavLink>
                <NavLink 
                  to={"/faq"}
                  className="hover:text-blue-300 transition-colors"
                >
                  FAQ
                </NavLink>
              </div>

              {/* Admin NavLinks */}
              <div>
                <h2>Admin Pages</h2>
                <NavLink 
                  to={"/admin/login"}
                >
                  Admin Login
                </NavLink>

                <NavLink 
                  to={"/admin/dashboard"} 
                >
                  Dashboard
                </NavLink>

                <NavLink 
                  to={"/admin/create-user"}
                >
                  Create User
                </NavLink>
              </div>

              {/* Staff NavLinks */}
              <div>
                <h2>Staff</h2>
                <NavLink 
                  to={"/staff/login"}
                >
                  Staff Login
                </NavLink>
                <NavLink 
                  to={"/staff/dashboard"}
                >
                  Dashboard
                </NavLink>

                <NavLink 
                  to={"/staff/update-user"}
                >
                  Update password
                </NavLink>

              </div>

              {/* Chat */}
              <NavLink 
                to={"chat"}
              >
                Chat
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer>
        <div>
          <p>&copy; { new Date().getFullYear()} All rights reversed</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;