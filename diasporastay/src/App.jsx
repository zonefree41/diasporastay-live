import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import DSNavbar from "./components/DSNavbar";
import DSFooter from "./components/DSFooter";

// Pages
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Hotel from "./pages/Hotel";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import MyBookings from "./pages/MyBookings";

// Admin
import AdminLogin from "./admin/Login";
import AdminDashboard from "./admin/Dashboard";
import AdminHotels from "./admin/Hotels";
import AdminOwners from "./admin/Owners";

// Owner pages
import OwnerDashboard from "./owners/OwnerDashboard";
import OwnerLogin from "./owners/OwnerLogin";
import OwnerRegister from "./owners/OwnerRegister";
import OwnerHotels from "./owners/OwnerHotels";
import AddHotel from "./owners/AddHotel";
import EditHotel from "./owners/EditHotel";
import Availability from "./owners/Availability";
import OwnerBookings from "./owners/OwnerBookings";
import OwnerEarnings from "./owners/OwnerEarnings";
import GuestProfile from "./guests/GuestProfile.jsx";
import GuestForgotPassword from "./guests/GuestForgotPassword";
import OwnerForgotPassword from "./owners/OwnerForgotPassword";
import OwnerResetPassword from "./owners/OwnerResetPassword";
import GuestResetPassword from "./guests/GuestResetPassword";
import OwnerEditProfile from "./owners/OwnerEditProfile";





// Guest
import GuestLogin from "./guests/GuestLogin";
import GuestRegister from "./guests/GuestRegister";
import GuestEditProfile from "./guests/GuestEditProfile";

// Protection
import OwnerProtectedRoute from "./components/OwnerProtectedRoute";

function OwnerProtected({ children }) {
  const token = localStorage.getItem("ownerToken");

  if (!token) {
    return <Navigate to="/owner/login" />;
  }

  return children;
}

function App() {
  return (
    <>
      <DSNavbar />

      <Routes>
        {/* PUBLIC PAGES */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/hotels/:id" element={<Hotel />} />

        {/* GUEST AUTH */}
        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/guest/register" element={<GuestRegister />} />
        <Route path="/guest/forgot-password" element={<GuestForgotPassword />} />
        <Route path="/guest/bookings" element={<MyBookings />} />
        <Route path="/guest/bookings" element={<MyBookings />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/guest/reset-password/:token" element={<GuestResetPassword />} />
        <Route path="/guest/profile/edit" element={<GuestEditProfile />} />



        {/* OWNER AUTH */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/guest/profile" element={<GuestProfile />} />
        <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
        <Route path="/owner/reset-password/:token" element={<OwnerResetPassword />} />
        <Route path="/owner/edit-profile" element={<OwnerEditProfile />} />


        {/* OWNER ROUTES PROTECTED */}
        <Route
          path="/owner/dashboard"
          element={
            <OwnerProtectedRoute>
              <OwnerDashboard />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/my-hotels"
          element={
            <OwnerProtectedRoute>
              <OwnerHotels />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/add-hotel"
          element={
            <OwnerProtectedRoute>
              <AddHotel />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/hotels/:id/edit"
          element={
            <OwnerProtectedRoute>
              <EditHotel />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/hotels/:id/availability"
          element={
            <OwnerProtectedRoute>
              <Availability />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/bookings"
          element={
            <OwnerProtectedRoute>
              <OwnerBookings />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/earnings"
          element={
            <OwnerProtectedRoute>
              <OwnerEarnings />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/owner/reset-password/:token"
          element={<OwnerResetPassword />}
        />


        {/* GUEST BOOKING PAGE */}
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* CHECKOUT */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/hotels" element={<AdminHotels />} />
        <Route path="/admin/owners" element={<AdminOwners />} />
      </Routes>

      <DSFooter />
    </>
  );
}

export default App;
