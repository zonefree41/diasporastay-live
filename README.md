# DiasporaStay Project Tracker

## Overall Completion: **83%**

### ✅ Backend / API (85–90%)
- [x] Express server & CORS
- [x] MongoDB connection (Mongoose)
- [x] Stripe Checkout (card payments)
- [x] Stripe Webhook (mark booking paid)
- [x] Stripe Connect for owners (payouts)
- [x] Country → gateway mapping API
- [ ] Finalize auth routes (owner/guest) in clean routes/controllers
- [ ] Ensure all models (Owner, Guest, Hotel, Booking) are in repo
- [ ] Remove duplicate /api/stripe/connect-account definitions

### ✅ Guest App (75–80%)
- [x] Home / Explore / Hotel pages
- [x] Checkout + Success page
- [x] Guest login & register
- [x] Guest forgot/reset password
- [x] Guest profile & edit profile (basic)
- [ ] MyBookings page wired to real data
- [ ] Polish Profile/EditProfile UI & error states
- [ ] Add empty states (no bookings, etc.)

### ✅ Owner App (80–85%)
- [x] Owner login & register
- [x] Owner forgot/reset password
- [x] Owner dashboard with charts
- [x] Owner hotels / add / edit / availability (basic)
- [x] Owner earnings page (basic)
- [x] Owner profile & edit profile
- [ ] Ensure analytics API matches dashboard expectations
- [ ] Polish hotel listings, bookings & earnings UI
- [ ] Client-side validation for profile & hotel forms

### ✅ Admin (40–50%)
- [x] Admin login page
- [x] Admin dashboard skeleton
- [x] AdminHotels & AdminOwners components created
- [ ] Hook admin login to real API
- [ ] Implement meaningful dashboard metrics
- [ ] Add approve/block/manage actions for hotels & owners

### ✅ Infra & Deployment (85–90%)
- [x] Vite + React configured
- [x] Concurrent dev (`npm run dev`) from root
- [x] CORS for local + Vercel domains
- [ ] Clean up duplicate dev scripts (root vs /diasporastay)
- [ ] Finalize deployment plan for backend API
- [ ] Add .env.example for safe sharing
