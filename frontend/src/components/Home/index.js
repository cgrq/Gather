import React from "react";
import SectionOne from "./SectionOne";
import "./Home.css";
import SectionTwo from "./SectionTwo";

function Home() {
    return (
        <div className="home-container">
            <SectionOne />
            <SectionTwo />
        </div>
    )
}

export default Home;
