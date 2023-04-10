import React from "react";
import SectionOne from "./SectionOne";
import "./Home.css";
import SectionTwo from "./SectionTwo";
import SectionThree from "./SectionThree";
import SectionFour from "./SectionFour";

function Home() {
    return (
        <div className="home-container">
            <SectionOne />
            <SectionTwo />
            <SectionThree />
            <SectionFour />
        </div>
    )
}

export default Home;
