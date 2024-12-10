import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // Navigate after logout

  const links = [
    { title: "Home", link: "/" },
    { title: "Book Store", link: "/all-books" },
    // user && { title: "Library", link: "/cart" },
    user && { title: "Donation", link: "/profile" },
  ].filter(Boolean); // Filter out any falsey values like `undefined` or `null`

  const handleLogout = () => {
    logout(); // Clear user data from context
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="bg-zinc-800 text-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0">
          <Link className="flex" to="/">
            <img
              className="h-10 w-40 object-contain"
              src="https://capstone-frontend-i62w.onrender.com/logo.jpeg"
              alt="logo"
            />
          </Link>
        </div>
        {/* Desktop Navbar */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="hover:text-blue-500 transition-all"
            >
              {item.title}
            </Link>
          ))}
          <div className="hidden lg:flex items-center gap-8">
            {user ? (
              <>
                <span className="text-white">Hi, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-500 text-white border rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="px-4 py-2 bg-white text-zinc-800 border rounded">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="px-4 py-2 bg-white text-zinc-800 border rounded">
                    Register
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"} // Dynamic label for better accessibility
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-zinc-800 text-white py-4 px-6 space-y-4">
          {links.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="block hover:text-blue-500"
              onClick={() => setIsMenuOpen(false)} // Close menu after clicking a link
            >
              {item.title}
            </Link>
          ))}
          {user ? (
            <>
              <span className="block">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 w-full bg-white text-zinc-800 border rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2 bg-white text-zinc-800 border rounded">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full px-4 py-2 bg-white text-zinc-800 border rounded">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
