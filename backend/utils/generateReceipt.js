// utils/generateReceipt.js
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function generateReceipt(booking, hotel, guestName) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40 });

        // Save file to temp folder
        const filePath = path.join("uploads", `receipt_${booking._id}.pdf`);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc.fontSize(22).text("Booking Receipt", { align: "center" });
        doc.moveDown(1);

        // Hotel Info
        doc.fontSize(14).text(`Hotel: ${hotel.name}`);
        doc.text(`Location: ${hotel.location || hotel.city + ", " + hotel.country}`);
        doc.moveDown(1);

        // Guest Info
        doc.text(`Guest: ${guestName}`);
        doc.text(`Booking ID: ${booking._id}`);
        doc.moveDown(1);

        // Dates
        doc.text(`Check-In: ${booking.checkIn}`);
        doc.text(`Check-Out: ${booking.checkOut}`);
        doc.text(`Nights: ${booking.nights}`);
        doc.moveDown(1);

        // Pricing
        doc.text(`Price per Night: $${hotel.pricePerNight}`);
        doc.fontSize(16).text(`Total Paid: $${booking.totalPrice}`, { bold: true });

        doc.moveDown(2);
        doc.text("Thank you for booking with Diasporastay!", { align: "center" });

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
    });
}
