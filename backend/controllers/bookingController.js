import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut } = req.body;

        if (!hotelId || !checkIn || !checkOut) {
            return res.status(400).json({ message: "Missing booking data" });
        }

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const nights =
            (new Date(checkOut) - new Date(checkIn)) /
            (1000 * 60 * 60 * 24);

        if (nights <= 0) {
            return res.status(400).json({ message: "Invalid dates" });
        }

        const totalPrice = hotel.pricePerNight * nights;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: hotel.name,
                        },
                        unit_amount: Math.round(totalPrice * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/hotels/${hotel._id}`,
        });

        // Save booking draft
        await Booking.create({
            guestId: req.guest._id,
            hotel: hotel._id,
            checkIn,
            checkOut,
            nights,
            pricePerNight: hotel.pricePerNight,
            totalPrice,
            stripeSessionId: session.id,
            status: "active",
            hotelSnapshot: {
                name: hotel.name,
                city: hotel.city,
                country: hotel.country,
                images: hotel.images,
            },
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error("CHECKOUT ERROR:", err);
        res.status(500).json({ message: "Stripe checkout failed" });
    }
};
