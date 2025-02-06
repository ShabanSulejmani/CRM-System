
function Form(){

    return(
        <div className="container">
            <h1>Form</h1>
            <form>
                <label htmlFor="firstname">First Name</label>
                <input type="text" placeholder="Enter First Name" name="firstname" />
                <br />

                <label htmlFor="lastname">Last Name</label>
                <input type="text" placeholder="Enter Last Name" name="lastname" />
                <br />

                <label htmlFor="email">Email</label>
                <input type="text" placeholder="Enter Email" name="email" />
                <br />


                <label htmlFor="gender">Gender</label>
                <input type="radio" name="gender" /> Male
                <input type="radio" name="gender" /> Female 
                <br />
                <br />

                <label htmlFor="subject">Subject</label>
                <select name="subject" id="subject">
                    <option value="math">Math</option>
                    <option value="Physic">Physic</option>
                    <option value="English">English</option>
                </select>

                <label htmlFor="resume">Resume</label>
                <input type="file" placeholder="Select Resume" name="resume"/>
                <br />

                <label htmlFor="url">URL</label>
                <input type="text" placeholder="Enter Image URL" name="url"/>
                <br />

                <label htmlFor="about">About</label>
                <br />
                <textarea name="about" id="about" cols="30" rows="10" placeholder="Enter description"></textarea>
                <button type="button">Reset</button>
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}

export default Form