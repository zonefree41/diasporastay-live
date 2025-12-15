export function bookingEmailTemplate({
    name,
    hotelImage,
    hotelName,
    hotelLocation,
    checkIn,
    checkOut,
    nights,
    totalPrice,
    myBookingsUrl
}) {
    const year = new Date().getFullYear();

    return `
    <div style="font-family: Arial; padding: 20px; color: #333;">
      <h2>Hi ${name}, your booking is confirmed! 🎉</h2>

      <img src="${hotelImage}" 
          style="width:100%; max-width:500px; border-radius:10px; margin: 20px 0;" />

      <h3>${hotelName}</h3>
      <p>${hotelLocation}</p>

      <hr />

      <p><strong>Check-In:</strong> ${checkIn}</p>
      <p><strong>Check-Out:</strong> ${checkOut}</p>
      <p><strong>Nights:</strong> ${nights}</p>
      <p><strong>Total:</strong> $${totalPrice}</p>

      <hr />

      <a href="${myBookingsUrl}" 
        style="background:#007bff;color:white;padding:10px 20px;
        text-decoration:none;border-radius:6px;">
        View My Bookings
      </a>

      <p style="margin-top:40px;color:#888;">
        © ${year} Diasporastay. All rights reserved.
      </p>
    </div>
  `;
}
