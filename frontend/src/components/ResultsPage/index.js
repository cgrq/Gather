import "./ResultsPage.css"
import { NavLink } from "react-router-dom";
import GroupListItem from "../Groups/GroupListItem";
import EventListItem from "../Events/EventListItem";
import { compareEventDates } from "../../utils/dates";

function ResultsPage({ page, dataObj }) {

    const data = Object.values(dataObj);

    if(page==="events"){
        data.sort(compareEventDates)
    }

    return (
        <div className="results-container">
            <div className="results-header-container">
                <ul className="results-nav">
                    <li>
                        <NavLink className={page === "groups" ? "looksDisabled" : ""} to="/events">
                            Events
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={page === "events" ? "looksDisabled" : ""} to="/groups">
                            Groups
                        </NavLink>
                    </li>
                </ul>
                <p>{(page === "groups" ? "Groups"  : "Events") + " in Gather"}</p>
            </div>
            <div className="results-body-container">
                {
                    page === "groups"
                        ? data.map((group) => <GroupListItem key={group.id} group={group} />)
                        : data.map((event) => <EventListItem key={event.id} event={event} />)
                }
            </div>
        </div>
    )
}

export default ResultsPage;
