import { useState, useEffect } from "react";
import moment from 'moment';
import { useDispatch } from "react-redux";
import { createEvent, createEventImage, removeEvent } from "../../store/events"
import { useHistory, useParams } from 'react-router-dom';
import { isValidURL } from '../../utils/validation'
import { formatDate } from "../../utils/dates";

function CreateEventPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const { groupId } = useParams();


    const normalizeTimeZone = (date) => {
        const momentDate = moment(date);
        return momentDate.local().format('YYYY-MM-DDTHH:mm');
    }

    useEffect(()=>{

        console.log(`🖥 ~ file: CreateEventPage.js:33 ~ CreateEventPage ~ startDate:`, startDate)
    },[startDate])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formattedStartDate = startDate ? formatDate(startDate) : "";
        const formattedEndDate = endDate ? formatDate(endDate) : "";
        const priceToInt = parseInt(price)
        console.log(`🖥 ~ file: CreateEventPage.js:29 ~ handleFormSubmit ~ price:`, price)
        console.log(`🖥 ~ file: CreateEventPage.js:29 ~ handleFormSubmit ~ priceToInt:`, priceToInt)


        const event = await dispatch(createEvent({ groupId, name, type, price: priceToInt, startDate: formattedStartDate, endDate: formattedEndDate, description }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    let urlError;
                    if (url.length === 0) urlError = "Image Url is required";
                    else if (!isValidURL(url)) urlError = "Invalid URL";
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            ...data.errors,
                            url: urlError
                        };
                    });
                }
            });
        const image = await dispatch(createEventImage({ eventId: event.id, url }))
            .catch(async (res) => {

                const data = await res.json();
                if (data && data.errors) {
                    const eventId = parseInt(event.id)

                    const removedGroup = await dispatch(removeEvent(eventId))
                        .catch(async (res) => {
                            const data = await res.json();
                            if (data && data.errors) {
                                setErrors(data.errors);
                            }
                        });
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
            <form className="create-event-page-form-container" onSubmit={handleFormSubmit}>
                <div className="create-event-page-row">
                    <h1>Create an event for {name}</h1>
                    <span>What is the name of your event?</span>
                    <input className="create-group-page-row-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Event Name" />
                    {
                        errors.name && <p className="create-event-page-errors">{errors.name}</p>
                    }
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <span>Is this an in person or online event?</span>
                        <select className="create-group-page-row-input" value={type} onChange={(e) => setType(e.target.value)} >
                            <option value="" disabled>(select one)</option>
                            <option value="In person">In person</option>
                            <option value="Online">Online</option>
                        </select>
                        {
                            errors.type && <p className="create-event-page-errors">{errors.type}</p>
                        }
                    </div>

                    <div className="create-event-page-sub-row">
                        <span>What is the price of your event?</span>
                        <div className="create-event-page-price-input-container">
                            <div className="create-event-page-price-input-overlay">$</div>
                            <input className="create-group-page-row-input create-event-page-price-input" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={"0"} />
                        </div>
                        {
                            errors.price && <p className="create-event-page-errors">{errors.price}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <span>When does  your event start?</span>
                        <input className="create-group-page-row-input" type="datetime-local"
                            value={startDate}
                            onChange={(e) => setStartDate(normalizeTimeZone(e.target.value))}
                            step="60"
                        />
                        {
                            errors.startDate && <p className="create-event-page-errors">{errors.startDate}</p>
                        }
                    </div>
                    <div className="create-event-page-sub-row">
                        <span>When does  your event end?</span>
                        <input className="create-group-page-row-input" type="datetime-local"
                            value={endDate}
                            onChange={(e) => setEndDate(normalizeTimeZone(e.target.value))}
                            step="60"
                        />
                        {
                            errors.endDate && <p className="create-event-page-errors">{errors.endDate}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <span>Please add an image url for your event below:</span>
                        <input className="create-group-page-row-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={"Image Url"} />
                        {
                            errors.url && <p className="create-event-page-errors">{errors.url}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <span>Please describe your event:</span>
                    <textarea className="create-group-page-row-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={"Please write at least 30 characters"} />
                    {
                        errors.description && <p className="create-event-page-errors">{errors.description}</p>
                    }
                </div>
                <div className="create-event-page-submit-row">
                    <button type="submit">Create Event</button>
                </div>
            </form>
        </div>
    )
}

export default CreateEventPage;