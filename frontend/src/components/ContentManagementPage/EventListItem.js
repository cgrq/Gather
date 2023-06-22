import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { seperateDateAndTime } from "../../utils/dates";
import "./ContentManagementPage.css";

function EventListItem({ event }) {
    const startDateTimeArr = seperateDateAndTime(event.startDate);
    const startDate = startDateTimeArr[0];
    const startTime = startDateTimeArr[1];
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
                <NavLink to={""}>Membership</NavLink>
            </div>
            <div>
                
            </div>
        </div>
    );
}

export default EventListItem;
