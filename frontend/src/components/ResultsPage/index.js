import "./ResultsPage.css"
import { NavLink } from "react-router-dom";
import GroupListItem from "../Groups/GroupListItem";

function ResultsPage({ page, dataObj }) {

    const data = Object.values(dataObj);

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
                <p>Groups in Gather</p>
            </div>
            <div className="results-body-container">
                {
                    page === "groups"
                        ? data.map((item) => <GroupListItem group={item} />)
                        : <></>
                }
            </div>
        </div>
    )
}

export default ResultsPage;
