import { Routes, Route } from "react-router-dom";

  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";


import Home from "./pages/Home";
import AllBooks from "./pages/AllBooks";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ForgotPassword from "./pages/ForgotPassword"; 

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-books" element={<AllBooks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <div className="flex-1"></div>
      <ToastContainer />
      <Footer />
    </>
  );
};

export default App;
