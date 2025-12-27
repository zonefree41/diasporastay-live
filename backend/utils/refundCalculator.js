export function calculateRefund(booking) {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);

    const hoursBeforeCheckIn =
        (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);

    switch (booking.refundPolicy) {
        case "FLEXIBLE_24H":
            return hoursBeforeCheckIn >= 24 ? booking.totalPrice : 0;

        case "MODERATE_48H":
            return hoursBeforeCheckIn >= 48 ? booking.totalPrice : 0;

        case "NON_REFUNDABLE":
            return 0;

        default:
            return 0;
    }
}
