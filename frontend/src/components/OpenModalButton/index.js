import React from "react";
import { useModal } from "../../context/Modal"

export const OpenModalButton = ({modalComponent, buttonText, onButtonClick, onModalClose}) => {
    const {setModalContent, setOnModalClose} = useModal();

    const onClick = (e) => {
        if(typeof onButtonClick === "function") onButtonClick();
        if(typeof onModalClose === "function") setOnModalClose(onModalClose);
        setModalContent(modalComponent);
    }

    return (
        <button onClick={onClick}>{buttonText}</button>
    )
}
