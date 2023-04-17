import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createGroup, createGroupImage, removeGroup } from "../../store/groups"
import { useHistory } from 'react-router-dom';
import { isValidURL } from '../../utils/validation'

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
                        if (url.length === 0) data.errors.url = "Image Url is required";
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
                    // const removedGroup = dispatch(removeGroup(group.Id))
                    setErrors((prevState) => {
                        return {
                            ...prevState,
                            ...data.errors,
                        };
                    });
                }
            });

        if (group.id && image.url) history.push(`/groups/${group.id}`);
    }

    return (
        <div className="create-group-page-container">
            <div className="create-group-page-row">
                <h3>BECOME AN ORGANIZER</h3>
                <h1>We'll walk you through a few steps to build your local community</h1>
            </div>
            <form className="create-group-page-form-container" onSubmit={handleFormSubmit}>
                <div className="create-group-page-row">
                    <h2>First steps...</h2>
                    <span>Gather groups meet locally, in person, and online, We'll connect you with people in your area, and more can join you online.</span>
                    <div className="login-main-input-container">
                        <label>
                            City and State
                        </label>
                        <input className="create-group-page-row-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, STATE" />
                    </div>
                    {
                        errors.city && <p className="create-group-page-errors">{errors.city}</p>
                    }
                    {
                        errors.state && <p className="create-group-page-errors">{errors.state}</p>
                    }
                </div>
                <div className="create-group-page-row">
                    <h2>What will your group's name be?</h2>
                    <span>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</span>
                    <div className="login-main-input-container">
                        <label>
                            Group name
                        </label>
                        <input className="create-group-page-row-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={"What is your group name?"} />
                    </div>
                    {
                        errors.name && <p className="create-group-page-errors">{errors.name}</p>
                    }
                </div>
                <div className="create-group-page-row">
                    <h2>Now describe what your group will be about</h2>
                    <ol className="create-group-page-list">
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <div className="login-main-input-container">
                        <label>
                            Group name
                        </label>
                        <textarea className="create-group-page-row-input" value={about} onChange={(e) => setAbout(e.target.value)} placeholder={"Please write at least 30 characters"} />
                    </div>
                    {
                        errors.about && <p className="create-group-page-errors">{errors.about}</p>
                    }
                </div>
                <div className="create-group-page-row">
                    <h2>Final steps...</h2>
                    <div className="create-group-page-sub-row-pair">
                        <div className="create-group-page-select-wrapper">
                            <span>Is this an in person or online group?</span>
                            <div className="login-main-input-container">
                                <label>
                                    In person or online?
                                </label>
                                <select className="create-group-page-row-input create-group-page-row-select" value={type} onChange={(e) => setType(e.target.value)} >
                                    <option value="" disabled></option>
                                    <option value="In person">In person</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>

                        </div>
                        <div className="create-group-page-select-wrapper">
                            <span>Is this group private or public?</span>
                            <div className="login-main-input-container">
                                <label>
                                    Private or public?
                                </label>
                                <select className="create-group-page-row-input create-group-page-row-select" value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)} >
                                    <option value="" disabled></option>
                                    <option value={true}>Private</option>
                                    <option value={false}>Public</option>
                                </select>
                            </div>

                        </div>

                    </div>
                    <div className={( errors.type || errors.private) ?"create-group-select-errors" : ""}>
                        {
                            errors.type && <p className="create-group-page-errors">{errors.type}</p>
                        }
                        {
                            errors.private && <p className="create-group-page-errors">{errors.private}</p>
                        }

                    </div>
                    <div className="create-group-page-sub-row">
                        <span>Please add an image url for your group below:</span>
                        <div className="login-main-input-container">
                            <label>
                                Image Url
                            </label>
                            <input className="create-group-page-row-input" value={url} onChange={(e) => setUrl(e.target.value)} />
                        </div>
                        {
                            errors.url && <p className="create-group-page-errors">{errors.url}</p>
                        }
                    </div>
                </div>
                <div className="create-group-page-submit-row">
                    <button type="submit">Create Group</button>
                </div>
            </form>
        </div>
    )
}

export default CreateGroupPage;
