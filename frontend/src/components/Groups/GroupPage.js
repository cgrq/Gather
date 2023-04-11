import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from "react-router-dom";
import { getGroup, getGroups } from "../../store/groups";

function GroupPage() {
    const dispatch = useDispatch()
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId]);
    const groups = useSelector(state => state.groups.allGroups);
    const sessionUser = useSelector(state => state.session.user);

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
            <div className="group-page-top-container">
                <div className="group-page-bread-crumb-row">
                    <NavLink to="/groups">{"< Groups"}</NavLink>
                </div>
                <div className="group-page-content-row">
                    <img src={group.GroupImages[0]} />
                    <div>
                        <div>{group.name}</div>
                        <div>{group.location}</div>
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
                                :<button>Join this group</button>}
                    </div>
                </div>
            </div>
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
                                ? groups[groupId].events.map(event => (
                                    <div>
                                        <img src={event.previewImage} />
                                        <div>
                                            <div>{event.startDate}</div>
                                            <div>{event.name}</div>
                                            <div>{event.Venue.city + ", " + event.Venue.state}</div>
                                        </div>
                                    </div>
                                ))
                                : <div>No upcoming events</div>
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GroupPage;
