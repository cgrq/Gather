import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createGroup, createGroupImage } from "../../store/groups"
import { useHistory } from 'react-router-dom';
import {isValidURL} from '../../utils/validation'

function CreateGroupPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const locationArr = location.split(",");
        if (locationArr.length > 1) {
            const city = locationArr[0].trim();
            const state = locationArr[1].trim();

            setCity(city);
            setState(state);
        }
    }, [location])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const group = await dispatch(createGroup({ name, about, type, isPrivate, city, state }))
        .catch(async (res) => {
            const data = await res.json();
            if (data && data.errors) {
                setErrors((prevState) => {
                    if(url.length === 0) data.errors.url = "Image Url is required";
                    else if (!isValidURL(url)) data.errors.url = "Invalid URL";

                    return {
                        ...prevState,
                        ...data.errors,
                    };
                });
            }
        });
        const image = await dispatch(createGroupImage({ groupId: group.id, url }))
        .catch(async (res) => {
            console.log(`🖥 ~ file: CreateGroupPage.js:52 ~ handleFormSubmit ~ res:`, res)
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

        if(group.id && image.url) history.push(`/groups/${group.id}`);
    }

return (
    <div className="create-group-page-container">
        <div className="create-group-page-row">
            <h3>BECOME AN ORGANIZER</h3>
            <h1>We'll walk you through a few steps to build your local community</h1>
        </div>
        <form onSubmit={handleFormSubmit}>
            <div className="create-group-page-row">
                <h1>Final steps...</h1>
                <label>Gather groups meet locally, in person, and online, We'll connect you with people in your area, and more can join you online.</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, STATE" />
                {
                    errors.city && <p className="create-group-page-errors">{errors.city}</p>
                }
                {
                    errors.state && <p className="create-group-page-errors">{errors.state}</p>
                }
            </div>
            <div className="create-group-page-row">
                <h1>What will your group's name be?</h1>
                <label>Choose a name that will ggive people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={"What is your group name?"} />
                {
                    errors.name && <p className="create-group-page-errors">{errors.name}</p>
                }
            </div>
            <div className="create-group-page-row">
                <h1>Now describe what your group will be about</h1>
                <ol className="create-group-page-list">
                    <li>What's the purpose of the group?</li>
                    <li>Who should join?</li>
                    <li>What will you do at your events?</li>
                </ol>
                <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder={"Please write at least 30 characters"} />
                {
                    errors.about && <p className="create-group-page-errors">{errors.about}</p>
                }
            </div>
            <div className="create-group-page-row">
                <h1>Final steps...</h1>
                <div className="create-group-page-sub-row">
                    <label>Is this an in person or online group?</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} >
                        <option value="" disabled>(select one)</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    {
                        errors.type && <p className="create-group-page-errors">{errors.type}</p>
                    }
                </div>
                <div className="create-group-page-sub-row">
                    <label>Is this group private or public?</label>
                    <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)} >
                        <option value="" disabled>(select one)</option>
                        <option value={true}>Private</option>
                        <option value={false}>Public</option>
                    </select>
                    {
                        errors.private && <p className="create-group-page-errors">{errors.private}</p>
                    }
                </div>
                <div className="create-group-page-sub-row">
                    <label>Please add an image url for your group below:</label>
                    <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={"Image Url"} />
                    {
                        errors.url && <p className="create-group-page-errors">{errors.url}</p>
                    }
                </div>
            </div>
            <div className="create-group-page-row">
                <button type="submit">Create Group</button>
            </div>
        </form>
    </div>
)
}

export default CreateGroupPage;
