import "./ResultsPage.css"
import { NavLink } from "react-router-dom";
import GroupListItem from "../Groups/GroupListItem";
import EventListItem from "../Events/EventListItem";
import { compareEventDates } from "../../utils/dates";

function ResultsPage({ page, dataObj }) {

    const data = Object.values(dataObj);

    if (page === "events") {
        data.sort(compareEventDates)
    }

    return (
        <div className="results-container">
            <div className="results-header-container">
                <div className="results-nav">
                    <NavLink className={page === "groups" ? "looksDisabled" : ""} to="/events">
                        Events
                    </NavLink>
                    <NavLink className={page === "events" ? "looksDisabled" : ""} to="/groups">
                        Groups
                    </NavLink>
                </div>
            </div>
            <div className="results-body-container">
                <div className="results-body-wrapper">
                    <div className="results-body-title">
                        <h2>{(page === "groups" ? "Groups" : "Events") + " in Gather"}</h2>
                    </div>
                    {
                        page === "groups"
                            ? data.map((group) => <GroupListItem key={group.id} group={group} />)
                            : data.map((event) => <EventListItem key={event.id} event={event} />)
                    }
                </div>
            </div>
        </div>
    )
}

export default ResultsPage;
