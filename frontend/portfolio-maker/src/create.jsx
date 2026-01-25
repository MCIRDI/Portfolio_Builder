import mainLogo from "./assets/logo.svg";
import "./landing.css";
import "./home.css";
import "./edit.css";

import { Link, useNavigate } from "react-router-dom";
import { createPublication } from "./services/publications";
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";

function Create() {
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", e.target.title.value);
        data.append("description", e.target.desc.value);
        data.append("image", e.target.image.files[0]);
        try {
            await createPublication(data);
            alert("Created successfully");
            navigate("/home");
        } catch (err) {
            console.error(err);
            alert("Create failed");
        }
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <div className="logo-block">
                        <img src={mainLogo} alt="logo"></img>
                    </div>
                    <div className="register-section share">
                        <p>Made with PortfolioMaker</p>
                    </div>

                    <div className="register-section">
                        <p>{user ? user.username : "Guest"}</p>
                    </div>
                </div>
            </header>

            <div className="landing-block">
                <div className="landing-block-content active">
                    <div className="publication-block">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter title"
                            />

                            <label htmlFor="image">Image</label>
                            <input type="file" id="image" name="image" accept="image/*" />

                            <label htmlFor="desc">Description</label>
                            <textarea
                                id="desc"
                                name="desc"
                                rows="5"
                                placeholder="Enter description"
                            ></textarea>

                            <div className="publication-button-section">
                                <button type="submit">Create</button>
                                <Link to="/home">
                                    <button className="red">Return</button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Create;
