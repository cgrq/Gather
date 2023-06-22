import { NavLink } from "react-router-dom/cjs/react-router-dom.min"
import OpenModalButton from "../OpenModalButton"
import DeleteAGroupModal from "../Groups/DeleteAGroupModal";
import "./ContentManagementPage.css"
import { useState } from "react";
import EventListItem from "./EventListItem";

export default function GroupListItem({ group }) {
    const [showEvents, setShowEvents] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const closeMenu = () => setShowMenu(false);

    return (
        <div className="content-management-list-item">
            <div className="content-management-top-wrapper">
                <div className="content-management-image-wrapper">
                    <NavLink to={`/groups/${group.id}`}>
                    <img src={group.previewImage} />

                    </NavLink>
                </div>
                <div className="content-management-list-item-details-wrapper">
                    <h3 className="content-management-name">{group.name}</h3>
                    <div className="content-management-buttons-wrapper">
                        <NavLink to={`/groups/${group.id}/events/new`}><button className="group-page-button group-page-button-create">Create event</button></NavLink>
                        <NavLink to={`/groups/${group.id}/edit`}><button className="group-page-button group-page-button-update">Update</button></NavLink>
                        <div className="group-page-delete-wrapper">
                            <OpenModalButton
                                buttonText="Delete"
                                onButtonClick={closeMenu}
                                modalComponent={<DeleteAGroupModal groupId={group.id} />} />
                        </div>
                    </div>
                    <NavLink to={`/manage/groups/${group.id}/events`}>Edit membership</NavLink>
                    <div className="content-management-show-events" onClick={()=>setShowEvents(!showEvents)}>{showEvents ? "Hide" : "View"} Events</div>
                </div>
            </div>
            <div className={`content-management-bottom-wrapper ${showEvents ? "" : "content-management-hide"}`}>
                {
                    Object.values(group.Events).map((event)=>(
                        <div>
                            <EventListItem event={event}/>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
