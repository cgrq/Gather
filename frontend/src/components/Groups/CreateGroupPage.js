
function CreateGroupPage() {
    return (
        <div>
            <div>
                <h3>BECOME AN ORGANIZER</h3>
                <h1>We'll walk you through a few steps to build your local community</h1>
            </div>
            <form>
                <div>
                    <h1>Final steps...</h1>
                    <label>Gather groups meet locally, in person, and online, We'll connect you with people in your area, and more can join you online.</label>
                    <input placeholder="City, STATE"/>
                </div>
                <div>
                    <h1>What will your group's name be?</h1>
                    <label>Choose a name that will ggive people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</label>
                    <input placeholder={"What is your group name?"}/>
                </div>
                <div>
                    <h1>Now describe what your group will be about</h1>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea placeholder={"Please write at least 30 characters"} />
                </div>
                <div>
                    <h1>Final steps...</h1>
                    <div>
                        <label>Is this an in person or online group?</label>
                        <select defaultValue="">
                            <option value="" disabled>(select one)</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </select>
                    </div>
                    <div>
                        <label>Is this group private or public?</label>
                        <select defaultValue="">
                            <option value="" disabled>(select one)</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                        </select>
                    </div>
                    <div>
                        <label>Please add an image url for your group below:</label>
                        <input placeholder={"Image Url"} />
                    </div>
                </div>
                <div>
                    <button>Create Group</button>
                </div>
            </form>
        </div>
    )
}

export default CreateGroupPage;
