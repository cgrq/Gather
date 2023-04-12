import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createEvent, createeventImage } from "../../store/events"
import { useHistory } from 'react-router-dom';
import { isValidURL } from '../../utils/validation'

function CreateEventPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const event = await dispatch(createEvent({ name, about, type, isPrivate, city, state }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors((prevState) => {
                        if (url.length === 0) data.errors.url = "Image Url is required";
                        else if (!isValidURL(url)) data.errors.url = "Invalid URL";

                        return {
                            ...prevState,
                            ...data.errors,
                        };
                    });
                }
            });
        const image = await dispatch(createEventImage({ eventId: event.id, url }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            ...data.errors,
                        };
                    });
                }
            });

        if (event.id && image.url) history.push(`/events/${event.id}`);
    }

    return (
        <div className="create-event-page-container">
            <form onSubmit={handleFormSubmit}>
                <div className="create-event-page-row">
                    <h1>Create an event for {name}</h1>
                    <label>What is the name of your event?</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Event Name" />
                    {
                        errors.name && <p className="create-event-page-errors">{errors.name}</p>
                    }
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <label>Is this an in person or online event?</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} >
                            <option value="" disabled>(select one)</option>
                            <option value="In person">In person</option>
                            <option value="Online">Online</option>
                        </select>
                        {
                            errors.type && <p className="create-event-page-errors">{errors.type}</p>
                        }
                    </div>
                    <div className="create-event-page-sub-row">
                        <label>Is this event private or public?</label>
                        <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)} >
                            <option value="" disabled>(select one)</option>
                            <option value="true">Private</option>
                            <option value="false">Public</option>
                        </select>
                        {
                            errors.private && <p className="create-event-page-errors">{errors.private}</p>
                        }
                    </div>
                    <div className="create-event-page-sub-row">
                        <label>What is the price of your event?</label>
                        <input value={price} onChange={(e) => setPrice(e.target.price)} placeholder={"0"} />
                        {
                            errors.price && <p className="create-event-page-errors">{errors.price}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                    <label>When does  your event start?</label>
                        <input type="datetime-local"
                            value={startDate}
                            onChange={(e)=>setStartDate(startDate)}
                            step="1"
                        />
                        {
                            errors.startDate && <p className="create-event-page-errors">{errors.startDate}</p>
                        }
                    </div>
                    <div className="create-event-page-sub-row">
                        <label>When does  your event end?</label>
                        <input type="datetime-local"
                            value={endDate}
                            onChange={(e)=>setEndDate(endDate)}
                            step="1"
                        />
                        {
                            errors.endDate && <p className="create-event-page-errors">{errors.endDate}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <label>Please add an image url for your event below:</label>
                        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={"Image Url"} />
                        {
                            errors.url && <p className="create-event-page-errors">{errors.url}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <label>Please describe your event:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={"Please write at least 30 characters"} />
                    {
                        errors.description && <p className="create-event-page-errors">{errors.description}</p>
                    }
                </div>
                <div className="create-event-page-row">
                    <button type="submit">Create Event</button>
                </div>
            </form>
        </div>
    )
}

export default CreateEventPage;
