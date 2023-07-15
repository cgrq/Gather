import React, { useRef, useState, useEffect } from 'react';
import lottie from 'lottie-web';
import animationData from "./home-splash-lottie.json";

function SectionOne() {
    const animationContainer = useRef(null);
    const [animationInstance, setAnimationInstance] = useState(null);

    useEffect(() => {
        if (animationContainer.current && !animationInstance) {
            const newAnimationInstance = lottie.loadAnimation({
                container: animationContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData,
            });
            setAnimationInstance(newAnimationInstance);
        }
    }, [animationContainer, animationInstance]);

    return (
        <div className="section-one-container">
            <div className="section-one-image-container home-image-container">
                <div className="section-one-lottie" ref={animationContainer} />
            </div>
            <div className="section-one-text-container">
                <h1 className="home-h1">There's nothing like a gathering.</h1>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    )
}
export default SectionOne;
