import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from "react-router-dom";
import "./Events.css";
import { getGroup } from "../../store/groups";
import { getEvent } from "../../store/events";
import GroupPreview from "../Groups/GroupPreview";
import { seperateDateAndTime } from "../../utils/dates";
import DeleteAnEventModal from "./DeleteAnEventModal";
import OpenModalButton from '../OpenModalButton';

function EventIdPage() {
    const ulRef = useRef();
    const dispatch = useDispatch()
    const { eventId } = useParams();
    const event = useSelector(state => state.events[eventId]);
    const groupState = useSelector(state => state.groups)
    // const events = useSelector(state => state.events.allEvents);
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const [eventImageUrl, setEventImageUrl] = useState()


    useEffect(() => {
        dispatch(getEvent(eventId));
    }, [dispatch, eventId])

    useEffect(() => {
        if (event && event.hasOwnProperty("Group")) {
            const groupId = event.Group.id;
            dispatch(getGroup(groupId));
        };
    }, [dispatch, event])

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    useEffect(()=>{
        if(event && event.EventImages && event.EventImages[0]){
            setEventImageUrl(event.EventImages[0].url);

        }

    },[event])


    if (!event || !groupState || !event.Group || !event.EventImages || event.EventImages.length === 0) return null;


    const groupId = event.Group.id;

    const group = groupState[groupId];

    if (!group) return null;

    const organizer = group.Organizer;

    const firstName = organizer.firstName;
    const lastName = organizer.lastName;


    const startDateTimeArr = seperateDateAndTime(event.startDate);
    const startDate = startDateTimeArr[0];
    const startTime = startDateTimeArr[1];
    const endDateTimeArr = seperateDateAndTime(event.endDate);
    const endDate = endDateTimeArr[0];
    const endTime = endDateTimeArr[1];


    const isOrganizer = (sessionUser && sessionUser.id) === organizer.id;
    return (
        <div className="event-page-container">
            <div className="event-page-bread-crumb-row">
                <NavLink to="/events">{"< Events"}</NavLink>
            </div>
            <div className="event-page-content-wrapper">
                <div className="event-page-top-background">
                    <div className="event-page-top-container">
                        <h1>{event.name}</h1>
                        <div>{`Hosted by ${firstName} ${lastName}`}</div>
                    </div>
                </div>
                <div className="event-page-bottom-background">
                    <div className="event-page-bottom-container">
                        <div className="event-page-content-row">
                            <div className="event-page-image-container">
                                <img onError={() => setEventImageUrl(process.env.PUBLIC_URL + "/default-image.png")} src={eventImageUrl} />
                            </div>
                            <div className="event-page-card-container">
                                <GroupPreview group={group} />
                                <div className="event-page-details-card">
                                    <div className="event-page-details-card-row">
                                        <div className="event-page-details-card-icon-wrapper"><i className="fa fa-clock" aria-hidden="true"></i></div>
                                        <div>
                                            <div className="event-page-details-date-pair">
                                                <div className="event-page-details-date-pair-label">START</div>
                                                <div>{`${startDate} · ${startTime}`}</div>
                                            </div>
                                            <div className="event-page-details-date-pair">
                                                <div className="event-page-details-date-pair-label">END</div>
                                                <div>{`${endDate} · ${endTime}`}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="event-page-details-card-row">
                                        <div className="event-page-details-card-icon-wrapper">
                                            <i className="fa fa-dollar-sign" aria-hidden="true"></i>
                                        </div>
                                        <div>{event.price > 0 ? event.price : "FREE"}</div>
                                    </div>
                                    <div className="event-page-details-card-row event-page-details-card-last-row">
                                        <div className="event-page-details-card-row-item-pair-wrapper">
                                            <div className="event-page-details-card-icon-wrapper"><i className="fa fa-map-pin" aria-hidden="true"></i></div>
                                            <div>{event.type}</div>
                                        </div>
                                        {
                                            isOrganizer
                                            && <div className="event-page-details-card-buttons">
                                                <NavLink  to={`/events/${eventId}/edit`}>
                                                <button className="event-page-update-button">Update</button>

                                                </NavLink>
                                                <OpenModalButton
                                                    buttonText="Delete"
                                                    onButtonClick={closeMenu}
                                                    modalComponent={<DeleteAnEventModal eventId={eventId} />} />
                                            </div>
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="event-page-content-row event-page-details-description-wrapper">
                                <h2>Details</h2>
                                <div className="event-page-details-description" >{event.description}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EventIdPage;
