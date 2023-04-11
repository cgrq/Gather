import { NavLink } from "react-router-dom";
import "./Events.css";

function EventListItem({ event }) {
    return (
        <NavLink to={`events/${event.id}`} className="nav-link">
            <div className="event-container">
                <img src={event.previewImage} />
                <div>
                    <div>{event.startDate}</div>
                    <h2>{event.name}</h2>
                    <div>{event.Venue.city + ", " + event.Venue.state}</div>
                </div>
            </div>
        </NavLink>
    )
}

export default EventListItem;
