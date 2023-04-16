import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function SectionThree() {
    const sessionUser = useSelector(state => state.session.user);
    const seeAllGroupsCaption = "Nunc sed augue lacus viverra vitae congue. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. Aliquam faucibus purus in massa tempor nec feugiat nisl.";



    return (
        <div className="section-three-container">
            <ActionCard
                iconImgPath={"./see-all-groups-icon.png"}
                linkPath={"/groups"}
                title={"See all groups"}
                caption={seeAllGroupsCaption} />
            <ActionCard
                iconImgPath={"./find-an-event-icon.png"}
                linkPath={"/events"}
                title={"Find an event"}
                caption={seeAllGroupsCaption} />
            <ActionCard
                iconImgPath={"./start-a-group-icon.png"}
                disabledIconImgPath={"./start-a-group-disabled-icon.png"}
                linkPath={"/groups/new"}
                title={"Start a group"}
                caption={seeAllGroupsCaption}
                disabled={sessionUser ? false : true} />
        </div>
    )
}

function ActionCard({ iconImgPath, disabledIconImgPath, linkPath, title, caption, disabled = false }) {
    return (
        <div className="action-card-container">
            <div className="home-image-container">
                <div className="home-image-shadow section-three-image-shadow" />
                <img src={disabled ? disabledIconImgPath : iconImgPath} />
            </div>
            <NavLink className={disabled ? " isDisabled" : ""} to={linkPath}>{title}</NavLink>
            <p>{caption}</p>
        </div>
    )
}

export default SectionThree;
