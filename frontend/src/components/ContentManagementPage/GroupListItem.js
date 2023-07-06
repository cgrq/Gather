import { NavLink } from "react-router-dom/cjs/react-router-dom.min"
import OpenModalButton from "../OpenModalButton"
import DeleteAGroupModal from "../Groups/DeleteAGroupModal";
import EditUsersModal from "./EditUsersModal";
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

                        <NavLink to={`/groups/${group.id}/edit`}><button className="content-management-button-update">Update</button></NavLink>
                        <div className="content-management-delete-wrapper">
                            <OpenModalButton
                                buttonText="Delete"
                                onButtonClick={closeMenu}
                                modalComponent={<DeleteAGroupModal groupId={group.id}  manage={true} />} />
                        </div>
                    </div>
                    <OpenModalButton
                        buttonText="Edit membership"
                        onButtonClick={closeMenu}
                        modalComponent={<EditUsersModal type="membership" id={group.id} />} />
                    <div className="content-management-show-events" onClick={() => setShowEvents(!showEvents)}>{showEvents ? "Hide" : "View"} Events</div>
                </div>
            </div>
            <div className={`content-management-bottom-wrapper ${showEvents ? "" : "content-management-hide"}`}>
                <NavLink to={`/groups/${group.id}/events/new`}><button className="content-management-button-create-event">+ Create event</button></NavLink>

                {
                    Object.values(group.Events).map((event) => (
                            <EventListItem event={event} group={group} />
                    ))
                }
            </div>
        </div>
    )
}
