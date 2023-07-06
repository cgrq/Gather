import { NavLink } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import EditUsersModal from "./EditUsersModal";
import DeleteAnEventModal from "../Events/DeleteAnEventModal";
import { useState, useEffect } from "react";
import { seperateDateAndTime } from "../../utils/dates";
import "./ContentManagementPage.css";

function EventListItem({ event }) {
    const [showMenu, setShowMenu] = useState(false);
    const closeMenu = () => setShowMenu(false);

    const startDateTimeArr = seperateDateAndTime(event.startDate);
    const startDate = startDateTimeArr[0];
    const startTime = startDateTimeArr[1];

    if(!event || !event.EventImages ||  !event.EventImages[0] || !event.EventImages[0].url) return null


    return (
        <div className="content-management-event-list-item-container">
            <div className="content-management-image-container">
                <NavLink to={`/events/${event.id}`}>
                    <img src={event.EventImages ? event.EventImages[0].url : event.previewImage} />
                </NavLink>
            </div>
            <div className="content-management-text-container">
                <span>{`${startDate} · ${startTime}`}</span>
                <h4>{event.name}</h4>
                <div className="content-management-buttons-wrapper">
                    <div className="event-page-details-card-buttons">
                        <NavLink to={`/events/${event.id}/edit`}>
                            <button className="event-page-update-button">Update</button>

                        </NavLink>
                        <div className="content-management-delete-wrapper">

                        <OpenModalButton
                            buttonText="Delete"
                            onButtonClick={closeMenu}
                            modalComponent={<DeleteAnEventModal eventId={event.id} />} />
                        </div>
                    </div>
                </div>
                <OpenModalButton
                    buttonText="Edit attendance"
                    onButtonClick={closeMenu}
                    modalComponent={<EditUsersModal type="attendance" id={event.id} />} />
            </div>

        </div>
    );
}

export default EventListItem;
