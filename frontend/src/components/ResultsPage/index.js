import "./ResultsPage.css"
import { NavLink } from "react-router-dom";
import GroupListItem from "../Groups/GroupListItem";

function ResultsPage({page, data}){
    return(
        <div className="results-container">
            <div className="results-header-container">
                <ul className="results-nav">
                    <li>
                        <NavLink className={page === "groups" ? "isDisabled" : ""} to="/events">
                            Events
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className={page === "events" ? "isDisabled" : ""} to="/groups">
                            Groups
                        </NavLink>
                    </li>
                </ul>
                <p>Groups in Gather</p>
            </div>
        </div>

    )
}

export default ResultsPage;
