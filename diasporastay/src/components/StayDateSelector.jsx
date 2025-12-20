import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function StayDateSelector({ pricePerNight, onChange }) {
    const [dates, setDates] = useState([null, null]);
    const [startDate, endDate] = dates;

    const nights =
        startDate && endDate
            ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
            : 0;

    const total = nights * pricePerNight;

    return (
        <div className="stay-date-box">
            <h5>Select your stay</h5>

            {/* ✅ THIS IS A POPUP — NOT INLINE */}
            <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                    setDates(update);
                    if (update[0] && update[1]) {
                        onChange({
                            checkIn: update[0],
                            checkOut: update[1],
                            nights,
                        });
                    }
                }}
                minDate={new Date()}
                monthsShown={2}
                placeholderText="Check-in → Check-out"
                className="stay-date-input"
                popperPlacement="bottom-start"
                withPortal
            />

            {nights > 0 && (
                <div className="mt-3">
                    <p>🌙 {nights} night(s)</p>
                    <p className="fw-bold">💵 Total: ${total}</p>
                </div>
            )}
        </div>
    );
}
