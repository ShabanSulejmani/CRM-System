// Layout.jsx
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/staff/login');
  };

  return (
    <div>
      {/* Navigation Header */}
      <nav>
        <div>
          <div>
            {/* Logo/Brand on the left */}
            <div className="navbar-left">
              <h1 className="project-name">WPT</h1>
            </div>

            {/* Mobile menu button */}
            <button className="mobile-menu-button" onClick={toggleMenu}>
              {menuOpen ? '✕' : '☰'}
            </button>

            {/* Main Navigation */}
            <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
              {/* Public NavLinks */}
              <div>
                <NavLink 
                  to={"/dynamisk"}
                  className="hover:text-blue-300 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Dynamiskt Formulär
                </NavLink>
                <NavLink 
                  to={"/faq"}
                  className="hover:text-blue-300 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  FAQ
                </NavLink>
              </div>

              {/* Admin NavLinks - Visas endast när användaren är inloggad som admin */}
              {isLoggedIn && user.role === 'admin' && (
                <div>
                  <h2>Admin</h2>
                  <NavLink 
                    to={"/admin/dashboard"} 
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>

                  <NavLink 
                    to={"/admin/create-user"}
                    onClick={() => setMenuOpen(false)}
                  >
                    Create User
                  </NavLink>
                </div>
              )}

              {/* Staff NavLinks */}
              <div>
                <h2>Staff</h2>
                {!isLoggedIn ? (
                  <NavLink 
                    to={"/staff/login"}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                ) : (
                  <>
                    <NavLink 
                      to={"/staff/dashboard"}
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink 
                      to={"/staff/update-user"}
                      onClick={() => setMenuOpen(false)}
                    >
                      Update password
                    </NavLink>
                  </>
                )}
              </div>

              {/* Chat */}
              <NavLink 
                to={"chat"}
                onClick={() => setMenuOpen(false)}
              >
                Chat
              </NavLink>
            </div>
            
            {/* Login/Användarinfo till höger */}
            <div className="navbar-right">
              {isLoggedIn ? (
                <div className="user-menu">
                  <span className="user-name">{user.username}</span>
                  <button onClick={handleLogout} className="logout-button">Logga ut</button>
                </div>
              ) : (
                <NavLink to="/staff/login">
                  <img src="/img/login.png" alt="Logga in" className="login-img"/>
                </NavLink>
              )}
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