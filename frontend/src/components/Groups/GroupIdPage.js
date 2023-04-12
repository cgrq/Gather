import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams, NavLink } from "react-router-dom";
import { getGroup, getGroups } from "../../store/groups";
import EventListItem from "../Events/EventListItem";

function GroupIdPage() {
    const dispatch = useDispatch()
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId]);
    const groups = useSelector(state => state.groups.allGroups);
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getGroups());
    }, [dispatch, groupId])
    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId])

    if (!group || !groups || !group.hasOwnProperty("GroupImages") || !groups[groupId] || !(groups.hasOwnProperty(groupId))) return null;
    let isOrganizer;
    if(group.Organizer){
        console.log(`🖥 ~ file: GroupIdPage.js:24 ~ GroupIdPage ~ group.Organizer:`, group.Organizer)
        isOrganizer = (sessionUser && sessionUser.id) === group.Organizer.id;
    }
    let numberOfEvents = 0;

    if(groups[groupId] && !(groups[groupId].hasOwnProperty("events"))){
        groups[groupId].events = [];
    }

    if(groups[groupId] && groups[groupId].hasOwnProperty("events") && groups[groupId].events && groups[groupId].events.length > 0){
        numberOfEvents = groups[groupId].events.length;
    }
    return (
        <div className="group-page-container">
            <div className="group-page-top-background">
                <div className="group-page-top-container">
                    <div className="group-page-bread-crumb-row">
                        <NavLink to="/groups">{"< Groups"}</NavLink>
                    </div>
                    <div className="group-page-content-row">
                        <img src={group.GroupImages ? group.GroupImages[0].url : ""} />
                        <div>
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
                    </div>
                    <div className="group-page-bottom-row group-page-events-row">
                        <h2>Upcoming Events</h2>
                        <div>
                            {
                                groups[groupId].events
                                && groups[groupId].events.map(event => {
                                    const now = new Date();
                                    const eventDate = new Date(event.startDate);
                                    if (now.getTime() < eventDate.getTime())

                                        return (
                                            <EventListItem key={event.id} event={event}/>
                                        )
                                })

                            }
                        </div>
                        <h2>Past Events</h2>
                        <div>
                            {
                                groups[groupId].events
                                && groups[groupId].events.map(event => {
                                    const now = new Date();
                                    const eventDate = new Date(event.startDate);
                                    if (now.getTime() > eventDate.getTime())

                                        return (
                                            <EventListItem key={event.id} event={event}/>
                                        )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupIdPage;
