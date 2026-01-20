import { useState } from "react";
import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";
import "./edit.css";
import { Link, useParams } from "react-router-dom";






function Edit() {
    const [page, setPage] = useState(0);
    const { username, id } = useParams();

    console.log(username);
    console.log(id);

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
                        {/* Username is needed there */}
                        <p>USERNAMEPLACEHOLDER</p>
                    </div>
                </div>
            </header>


            <div className="landing-block">


                <div className="landing-block-content active">

                    <div className="publication-block">
                        <form>
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" placeholder="Enter title" />

                            <label for="image">Image</label>
                            <input type="file" id="image" name="image" accept="image/*" />

                            <label for="desc">Description</label>
                            <textarea id="desc" name="desc" rows="5" placeholder="Enter description"></textarea>

                            <div className="publication-button-section">
                                <button className="green" type="submit">Apply</button>
                                <Link to="/home">
                                    <button className="red">Return</button>
                                </Link>
                            </div>
                            
                        </form>


                    </div>


                </div>


            </div >



        </>
    );
}

export default Edit;
