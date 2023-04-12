import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Events.css";
import { seperateDateAndTime } from "../../utils/dates";

function EventListItem({ event }) {
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!event) {
            return null;
        }

        async function fetchEventById() {
            const res = await fetch(`/api/events/${event.id}`);
            const eventData = await res.json();
            setDescription(eventData.description);
        }

        fetchEventById();
    }, [event]);

    const startDateTimeArr = seperateDateAndTime(event.startDate);
    const startDate = startDateTimeArr[0];
    const startTime = startDateTimeArr[1];

    return (
        <NavLink to={`/events/${event.id}`} className="nav-link">
            <div className="event-details-container">
                <div className="event-top-row-container">
                    <img src={event.previewImage} />
                    <div>
                        <div>{`${startDate} · ${startTime}`}</div>
                        <h2>{event.name}</h2>
                        <div>{event.Venue.city + ", " + event.Venue.state}</div>
                    </div>
                </div>
                <div className="event-bottom-row-container">{description}</div>
            </div>
        </NavLink>
    );
}

export default EventListItem;
