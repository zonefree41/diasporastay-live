// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import DSNavbar from "./components/DSNavbar";
import DSFooter from "./components/DSFooter";

/* ================= PUBLIC ================= */
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Hotel from "./pages/Hotel";

/* ================= BOOKING ================= */
import Checkout from "./pages/Checkout";
import MyBookings from "./pages/MyBookings";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel";
import BookingDetails from "./pages/BookingDetails.jsx";

/* ================= LEGAL ================= */
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Refund from "./pages/legal/Refund";

/* ================= GUEST ================= */
import GuestLogin from "./guests/GuestLogin";
import GuestRegister from "./guests/GuestRegister";
import GuestForgotPassword from "./guests/GuestForgotPassword";
import GuestResetPassword from "./guests/GuestResetPassword";
import GuestProfile from "./guests/GuestProfile";
import GuestEditProfile from "./guests/GuestEditProfile";
import GuestProtectedRoute from "./components/GuestProtectedRoute";


/* ================= OWNER AUTH ================= */
import OwnerLogin from "./owners/OwnerLogin";
import OwnerRegister from "./owners/OwnerRegister";
import OwnerForgotPassword from "./owners/OwnerForgotPassword";
import OwnerResetPassword from "./owners/OwnerResetPassword";
import OwnerEditProfile from "./owners/OwnerEditProfile";


/* ================= OWNER PAGES ================= */
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerHotels from "./owners/OwnerHotels";
import AddHotel from "./owners/AddHotel";
import EditHotel from "./owners/EditHotel";
import Availability from "./owners/Availability";
import OwnerBookings from "./owners/OwnerBookings";
import OwnerEarnings from "./owners/OwnerEarnings";
import OwnerPayoutHistory from "./owners/OwnerPayoutHistory";
import OwnerStripeConnect from "./pages/OwnerStripeConnect";
import OwnerStripeSuccess from "./pages/OwnerStripeSuccess";

/* ================= ADMIN ================= */
import AdminLogin from "./admin/Login";
import AdminDashboard from "./admin/Dashboard";
import AdminHotels from "./admin/Hotels";
import AdminOwners from "./admin/Owners";
import AdminPayoutDashboard from "./pages/admin/AdminPayoutDashboard";

/* ================= ROUTE PROTECTION ================= */
import OwnerProtectedRoute from "./components/OwnerProtectedRoute";

function App() {
  return (
    <>
      <DSNavbar />

      <Routes>
        {/* ========== PUBLIC ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/hotels/:id" element={<Hotel />} />

        {/* ========== GUEST ========== */}
        <Route path="/guest/login" element={<GuestLogin />} />
        <Route path="/guest/register" element={<GuestRegister />} />
        <Route path="/guest/forgot-password" element={<GuestForgotPassword />} />
        <Route path="/guest/reset-password/:token" element={<GuestResetPassword />} />
        <Route path="/guest/profile" element={<GuestProfile />} />
        <Route path="/guest/profile/edit" element={<GuestEditProfile />} />


        {/* ========== BOOKING ========== */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/cancel" element={<BookingCancel />} />
        <Route path="/my-bookings/:id" element={<BookingDetails />} />


        {/* ========== LEGAL ========== */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund-policy" element={<Refund />} />

        {/* ========== OWNER AUTH ========== */}
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/register" element={<OwnerRegister />} />
        <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
        <Route path="/owner/reset-password/:token" element={<OwnerResetPassword />} />
        <Route path="/owner/edit-profile" element={<OwnerEditProfile />} />

        {/* ========== OWNER STRIPE ========== */}
        <Route
          path="/owner/stripe"
          element={
            <OwnerProtectedRoute>
              <OwnerStripeConnect />
            </OwnerProtectedRoute>
          }
        />
        <Route
          path="/owner/stripe/success"
          element={
            <OwnerProtectedRoute>
              <OwnerStripeSuccess />
            </OwnerProtectedRoute>
          }
        />

        {/* ========== OWNER DASHBOARD ========== */}
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
          path="/owner/payouts/history"
          element={
            <OwnerProtectedRoute>
              <OwnerPayoutHistory />
            </OwnerProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <GuestProtectedRoute>
              <MyBookings />
            </GuestProtectedRoute>
          }
        />

        <Route
          path="/guest/profile"
          element={
            <GuestProtectedRoute>
              <GuestProfile />
            </GuestProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <GuestProtectedRoute>
              <MyBookings />
            </GuestProtectedRoute>
          }
        />

        <Route
          path="/my-bookings/:id"
          element={
            <GuestProtectedRoute>
              <BookingDetails />
            </GuestProtectedRoute>
          }
        />

        {/* ========== ADMIN ========== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/hotels" element={<AdminHotels />} />
        <Route path="/admin/owners" element={<AdminOwners />} />
        <Route path="/admin/payouts" element={<AdminPayoutDashboard />} />

        {/* ========== FALLBACK (LAST!) ========== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <DSFooter />
    </>
  );
}

export default App;
