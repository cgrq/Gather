import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById, updateGroup, updateGroupImage, removeGroup } from "../../store/groups"
import { useHistory, useParams } from 'react-router-dom';
import { isValidURL } from '../../utils/validation'

function UpdateGroupPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [url, setUrl] = useState("");
    const [errors, setErrors] = useState({});
    const { groupId } = useParams();
    const group = useSelector(state => state.groups[groupId])
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(getGroupById(groupId));
    }, [dispatch, groupId])

    useEffect(() => {
        if (group) {
            setName(group.name);
            setAbout(group.about);
            setType(group.type);
            setIsPrivate(group.private.toString());
            setLocation(`${group.city}, ${group.state}`)
        }

    }, [group])
    useEffect(() => {
        const locationArr = location.split(",");
        if (locationArr.length > 1) {
            const city = locationArr[0].trim();
            const state = locationArr[1].trim();

            setCity(city);
            setState(state);
        }
    }, [location])

    const updateFile = e => {
        const file = e.target.files[0];
        if (file) setImageFile(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const group = await dispatch(updateGroup({ groupId, name, about, type, isPrivate, city, state }))
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
        let image;
        if (imageFile) {
            image = await dispatch(updateGroupImage({ groupId: group.id, imageFile }))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        const groupId = parseInt(group.id)

                        const removedGroup = await dispatch(removeGroup(groupId))
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
        }


        if (group && group.id ) history.push(`/groups/${group.id}`);
    }

    if (!group || !sessionUser || !group.Organizer) return null;

    const organizer = group.Organizer;
    const isOrganizer = sessionUser.id === organizer.id;

    if (!isOrganizer) history.push(`/`);


    return (
        <div className="create-group-page-container">
            <div className="create-group-page-row">
                <h3>UPDATE YOUR GROUP'S INFORMATION</h3>
                <h1>We'll walk you through a few steps to update your group's information</h1>
            </div>
            <form className="create-group-page-form-container" onSubmit={handleFormSubmit}>
                <div className="create-group-page-row">
                    <h1>First, set your group's location.</h1>
                    <span>Gather groups meet locally, in person, and online, We'll connect you with people in your area, and more can join you online.</span>
                    <input className="create-group-page-row-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, STATE" />
                    {
                        errors.city && <p className="create-group-page-errors">{errors.city}</p>
                    }
                    {
                        errors.state && <p className="create-group-page-errors">{errors.state}</p>
                    }
                </div>
                <div className="create-group-page-row">
                    <h1>What is the name of your group?</h1>
                    <span>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</span>
                    <input className="create-group-page-row-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={"What is your group name?"} />
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
                    <textarea className="create-group-page-row-input" value={about} onChange={(e) => setAbout(e.target.value)} placeholder={"Please write at least 30 characters"} />
                    {
                        errors.about && <p className="create-group-page-errors">{errors.about}</p>
                    }
                </div>
                <div className="create-group-page-row">
                    <h1>Final steps...</h1>
                    <div className="create-group-page-sub-row">
                        <span>Is this an in person or online group?</span>
                        <select className="create-group-page-row-input" value={type} onChange={(e) => setType(e.target.value)} >
                            <option value="" disabled>(select one)</option>
                            <option value="In person">In person</option>
                            <option value="Online">Online</option>
                        </select>
                        {
                            errors.type && <p className="create-group-page-errors">{errors.type}</p>
                        }
                    </div>
                    <div className="create-group-page-sub-row">
                        <span>Is this group private or public?</span>
                        <select className="create-group-page-row-input" value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)} >
                            <option value="" disabled>(select one)</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                        {
                            errors.private && <p className="create-group-page-errors">{errors.private}</p>
                        }
                    </div>
                    <div className="login-main-input-container">
                        <label>
                            Image
                        </label>
                        <input className="create-group-page-row-input" type="file" onChange={updateFile} />
                    </div>
                </div>
                <div className="create-group-page-submit-row">
                    <button type="submit">Update Group</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateGroupPage;
