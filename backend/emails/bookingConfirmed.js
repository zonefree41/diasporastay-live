export function bookingConfirmedEmail({ guestName, hotelName, checkIn, checkOut, total }) {
    return `
    <div style="font-family: Arial; max-width:600px;">
      <h2>✅ Booking Confirmed</h2>

      <p>Hi ${guestName || "Guest"},</p>

      <p>Your stay at <strong>${hotelName}</strong> is confirmed 🎉</p>

      <ul>
        <li><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</li>
        <li><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</li>
        <li><strong>Total Paid:</strong> $${total}</li>
      </ul>

      <p>You can view your booking anytime in your account.</p>

      <hr/>
      <p style="font-size:12px;color:#666;">
        DiasporaStay · Safe stays for the diaspora
      </p>
    </div>
  `;
}
