import { NavLink } from "react-router-dom";

function GroupListItem({group}){
    console.log(`🖥 ~ file: GroupListItem.js:4 ~ GroupListItem ~ group:`, group)
    return(
        <NavLink to={`groups/${group.id}`} className="nav-link">
            <div className="item-container">
                <div className="image-container">
                    <img src={group.previewImage} />
                </div>
                <div className="text-container">
                    <div>{group.name}</div>
                    <div>{`${group.city}, ${group.state}`}</div>
                    <div className="about">{group.about}</div>
                    <div>{`${group.events ? group.events.length : 0} ${(group.events && group.events.length !== 1) ? "events" : "event"}`} · {group.private ? "Private" : "Public"}</div>
                    <div></div>
                </div>
            </div>
        </NavLink>
    )
}

export default GroupListItem;
