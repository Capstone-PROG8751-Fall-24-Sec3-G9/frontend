import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseUrl + "/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        const result = await response.json();
        setError(result.message); // Show error message
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('./register.jpg')" }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-6 sm:p-8 space-y-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Register
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Register
            </button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
