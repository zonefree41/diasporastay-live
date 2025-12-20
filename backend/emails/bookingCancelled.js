export function bookingCancelledEmail({ hotelName, checkIn, checkOut }) {
    return `
    <div style="font-family: Arial; max-width:600px;">
      <h2>❌ Booking Cancelled</h2>

      <p>Your booking at <strong>${hotelName}</strong> has been cancelled.</p>

      <p>
        ${new Date(checkIn).toDateString()} → ${new Date(checkOut).toDateString()}
      </p>

      <p>If this was a mistake, you’re welcome to re-book anytime.</p>

      <hr/>
      <p style="font-size:12px;color:#666;">
        DiasporaStay Support
      </p>
    </div>
  `;
}
