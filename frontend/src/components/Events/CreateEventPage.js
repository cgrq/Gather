import { useState, useEffect } from "react";
import moment from 'moment-timezone';
import { useDispatch } from "react-redux";
import { createEvent, createEventImage, removeEvent } from "../../store/events"
import { useHistory, useParams } from 'react-router-dom';

function CreateEventPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState({});
    const { groupId } = useParams();

    const normalizeTimeZone = (date) => {
        const userTimezone = moment.tz.guess();
        return moment.tz(date, userTimezone).utc().format('YYYY-MM-DDTHH:mm:ss');
      };


    useEffect(() => {

    }, [startDate]);

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImageFile(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const formattedStartDate = startDate ? normalizeTimeZone(startDate) : "";
        const formattedEndDate = endDate ? normalizeTimeZone(endDate) : "";
        const priceToInt = parseInt(price);

        const event = await dispatch(createEvent({ groupId, name, type, price: priceToInt, startDate: formattedStartDate, endDate: formattedEndDate, description }))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors((prevState) => {
                        if (!imageFile) data.errors.url = "Image is required";
                        return {
                            ...prevState,
                            ...data.errors,
                        };
                    });
                }
            });

        const image = await dispatch(createEventImage({ eventId: event.id, imageFile }))
            .catch(async (res) => {

                const data = await res.json();
                if (data && data.errors) {
                    const eventId = parseInt(event.id);

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

        if (event.id && image.id) history.push(`/events/${event.id}`);
    };

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
                            onChange={(e) => setStartDate(e.target.value)}
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
                            onChange={(e) => setEndDate(e.target.value)}
                            step="60"
                        />
                        {
                            errors.endDate && <p className="create-event-page-errors">{errors.endDate}</p>
                        }
                    </div>
                </div>
                <div className="create-event-page-row">
                    <div className="create-event-page-sub-row">
                        <span>Please add an image for your event below:</span>
                        <input className="create-group-page-row-input" type="file" onChange={updateFile} />
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
    );
}

export default CreateEventPage;
