import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { isValidURL } from "../../utils/validation";

function GroupListItem({ group }) {
    const [imageUrl, setImageUrl] = useState(process.env.PUBLIC_URL + "/default-image.png")

    useEffect(() => {
        if (group && isValidURL(group.previewImage)) {
            setImageUrl(group.previewImage)
        }
    }, [group])
    return (
        <NavLink to={`groups/${group.id}`} className="nav-link">
            <div className="item-container">
                <div className="image-container">
                    <div className="item-image-shadow"></div>
                    <img onError={() => setImageUrl(process.env.PUBLIC_URL + "/default-image.png")} src={imageUrl} />
                </div>
                <div className="text-container">
                    <h2>{group.name}</h2>
                    <h3>{`${group.city}, ${group.state}`}</h3>
                    <p>{group.about}</p>
                    <span><span>{`${group.events ? group.events.length : 0} ${(group.events && group.events.length !== 1) ? "events" : "event"}`}</span> <div>·</div> <p>{group.private ? "Private" : "Public"}</p></span>
                </div>
            </div>
        </NavLink>
    )
}

export default GroupListItem;
