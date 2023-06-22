import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from "react-router-dom";
import { getGroup, getGroups } from "../../store/groups";
import EventListItem from "../Events/EventListItem";
import DeleteAGroupModal from "./DeleteAGroupModal";
import OpenModalButton from '../OpenModalButton';


function GroupIdPage() {
    const dispatch = useDispatch()
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL + "/default-image.png")
    const { groupId } = useParams();
    const events = useSelector(state => state.events.allEvents);
    const group = useSelector(state => state.groups[groupId]);
    const groups = useSelector(state => state.groups.allGroups);
    const sessionUser = useSelector(state => state.session.user);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    useEffect(() => {
        if (group && group.hasOwnProperty("GroupImages") && group.GroupImages.length > 0) {
            setImageUrl(group.GroupImages[0].url)
        }
    }, [group])

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch, groupId, events])
    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId, events])

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


    if (!group || !groups || !group.hasOwnProperty("GroupImages") || !groups[groupId] || !(groups.hasOwnProperty(groupId))) return null;
    let isOrganizer;
    if (group.Organizer) {
        isOrganizer = (sessionUser && sessionUser.id) === group.Organizer.id;
    }
    let numberOfEvents = 0;

    if (groups[groupId] && !(groups[groupId].hasOwnProperty("events"))) {
        groups[groupId].events = [];
    }

    if (groups[groupId] && groups[groupId].hasOwnProperty("events") && groups[groupId].events && groups[groupId].events.length > 0) {
        numberOfEvents = groups[groupId].events.length;
    }
    return (
        <div className="group-page-container">
            <div className="group-page-bread-crumb-row">
                <NavLink to="/groups">{"< Groups"}</NavLink>
            </div>
            <div className="group-page-content-container">
                <div className="group-page-top-background">
                    <div className="group-page-content-row">
                        <div className="group-page-image-container">
                            <img onError={() => setImageUrl(process.env.PUBLIC_URL + "/default-image.png")} src={imageUrl} />
                        </div>
                        <div className="text-container group-page-text-container">
                            <h1 className="group-name">{group.name}</h1>
                            <div>{group.city + ", " + group.state} </div>
                            <div>{`${numberOfEvents}
                                ${(numberOfEvents === 1)
                                    ? "event"
                                    : "events"}
                                ·
                                ${groups[groupId] && groups[groupId].private
                                    ? "Private"
                                    : "Public"}`}</div>
                            <div>{ }</div>
                            <div>{`Organized by: ${group.Organizer.firstName} ${group.Organizer.lastName}`}</div>
                            {
                                (isOrganizer || !sessionUser)
                                    ? ""
                                    : <button
                                        className="join-button"
                                        onClick={() => alert("Feature coming soon")}>
                                        Join this group
                                    </button>
                            }
                            {
                                (isOrganizer)
                                &&
                                <div className="group-page-crud-buttons">
                                    <NavLink  to={`/groups/${groupId}/events/new`}><button className="group-page-button group-page-button-create">Create event</button></NavLink>
                                    <NavLink  to={`/groups/${groupId}/edit`}><button className="group-page-button group-page-button-update">Update</button></NavLink>
                                    <div className="group-page-delete-wrapper">
                                        <OpenModalButton
                                            buttonText="Delete"
                                            onButtonClick={closeMenu}
                                            modalComponent={<DeleteAGroupModal groupId={groupId} />} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="group-page-bottom-background">
                    <div className="group-page-bottom-container">
                        <div className="group-page-bottom-row">
                            <h2>Organizer</h2>
                            <p >{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                        </div>
                        <div className="group-page-bottom-row">
                            <h2>What we're about</h2>
                            <p className="group-page-about">{groups[groupId].about}</p>
                        </div>
                        <div className="group-page-events-row">
                            <h2>Upcoming Events</h2>
                            <div className="group-page-upcoming-events">
                                {
                                    groups[groupId].events
                                    && groups[groupId].events.map(event => {
                                        const now = new Date();
                                        const eventDate = new Date(event.startDate);
                                        if (now.getTime() < eventDate.getTime())

                                            return (
                                                <EventListItem key={event.id} event={event} />
                                            )
                                    })

                                }
                            </div>
                            <h2>Past Events</h2>
                            <div>
                                {
                                    groups[groupId].Events
                                    && groups[groupId].Events.map(event => {
                                        const now = new Date();
                                        const eventDate = new Date(event.startDate);
                                        if (now.getTime() > eventDate.getTime())

                                            return (
                                                <EventListItem key={event.id} event={event} />
                                            )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupIdPage;
