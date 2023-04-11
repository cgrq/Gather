import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from "react-router-dom";
import { getGroup, getGroups } from "../../store/groups";

function GroupIdPage() {
    const dispatch = useDispatch()
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId]);
    const groups = useSelector(state => state.groups.allGroups);
    const sessionUser = useSelector(state => state.session.user);
    // const newDate = new Date();
    // const year = newDate.getFullYear();
    // const month = String(newDate.getMonth() + 1).padStart(2, '0');
    // const day = String(newDate.getDate()).padStart(2, '0');
    // const hours = String(newDate.getHours()).padStart(2, '0');
    // const minutes = String(newDate.getMinutes()).padStart(2, '0');
    // const seconds = String(newDate.getSeconds()).padStart(2, '0');
    // const timeNow = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch])
    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch])

    if (!group || !groups) return null;

    const isOrganizer = (sessionUser && sessionUser.id) === group.Organizer.id;
    const numberOfEvents = groups[groupId].events.length > 0 ? groups[groupId].events.length : 0;
    return (
        <div className="group-page-container">
            <div className="group-page-top-background">
                <div className="group-page-top-container">
                    <div className="group-page-bread-crumb-row">
                        <NavLink to="/groups">{"< Groups"}</NavLink>
                    </div>
                    <div className="group-page-content-row">
                        <img src={group.GroupImages[0].url} />
                        <div>
                            <h1 className="group-name">{group.name}</h1>
                            <div>{group.city + ", " + group.state} </div>
                            <div>{`${numberOfEvents}
                                ${(numberOfEvents === 1)
                                    ? "event"
                                    : "events"}
                                ·
                                ${groups[groupId].private
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
                                <div>
                                    <button>Create event</button>
                                    <button>Update</button>
                                    <button>Delete</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="group-page-bottom-background">
                <div className="group-page-bottom-container">
                    <div className="group-page-bottom-row">
                        <h2>Organizer</h2>
                        <p>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                    </div>
                    <div className="group-page-bottom-row">
                        <h2>What we're about</h2>
                        <p>{groups[groupId].about}</p>
                    </div><div className="group-page-bottom-row">
                        <h2>Upcoming Events</h2>
                        <p>
                            {
                                groups[groupId].events
                                && groups[groupId].events.map(event => {
                                    const now = new Date();
                                    const eventDate = new Date(event.startDate);
                                    if (now.getTime() < eventDate.getTime())

                                        return (
                                            <div className ="event-container">
                                                <img src={event.previewImage} />
                                                <div>
                                                    <div>{event.startDate}</div>
                                                    <h2>{event.name}</h2>
                                                    <div>{event.Venue.city + ", " + event.Venue.state}</div>
                                                </div>
                                            </div>
                                        )
                                })

                            }
                        </p>
                        <h2>Past Events</h2>
                        <p>
                            {
                                groups[groupId].events
                                && groups[groupId].events.map(event => {
                                    const now = new Date();
                                    const eventDate = new Date(event.startDate);
                                    if (now.getTime() > eventDate.getTime())

                                        return (
                                            <div className ="event-container">
                                                <img src={event.previewImage} />
                                                <div>
                                                    <div>{event.startDate}</div>
                                                    <h2>{event.name}</h2>
                                                    <div>{event.Venue.city + ", " + event.Venue.state}</div>
                                                </div>
                                            </div>
                                        )
                                })
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupIdPage;
