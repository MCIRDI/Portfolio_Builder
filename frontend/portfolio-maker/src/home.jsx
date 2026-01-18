import { useState } from "react";
import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";



function Publication({ title, image, description, user }) {
    return (
        <div className="publication-block">


            <div className="publication-block-top">

                <div className="publication-img">
                    {/* This is image from data */}
                    <img src={image} alt="logo"></img>
                </div>


                <div className="publication-title">

                    {/* This is title from data */}
                    <h3>{title}</h3>
                    <div className="publication-button-section">

                        {/* This button should readress to personal edit page */}

                            <button className="edit-button">

                                <p>Edit</p>

                                {/* a casual svg image. Don`t bother... */}
                                <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink"
                                    width="15px" height="15px" viewBox="0 0 528.899 528.899"
                                    xml: space="preserve">
                                    <g>
                                        <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
		c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
		C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
		L27.473,390.597L0.3,512.69z"/>
                                    </g>
                                </svg>
                            </button>


                        {/* This button should delete publication and then update the DOM */}

                            <button className="edit-button remove-button">

                                <p>Remove</p>
                                {/* The same casual svg image. Moreover, don`t bother yourself... */}
                                <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns: xlink="http://www.w3.org/1999/xlink"
                                    width="20px" height="20px" viewBox="0 0 482.428 482.429"
                                    xml: space="preserve">
                                    <g>
                                        <g>
                                            <path d="M381.163,57.799h-75.094C302.323,25.316,274.686,0,241.214,0c-33.471,0-61.104,25.315-64.85,57.799h-75.098
			c-30.39,0-55.111,24.728-55.111,55.117v2.828c0,23.223,14.46,43.1,34.83,51.199v260.369c0,30.39,24.724,55.117,55.112,55.117
			h210.236c30.389,0,55.111-24.729,55.111-55.117V166.944c20.369-8.1,34.83-27.977,34.83-51.199v-2.828
			C436.274,82.527,411.551,57.799,381.163,57.799z M241.214,26.139c19.037,0,34.927,13.645,38.443,31.66h-76.879
			C206.293,39.783,222.184,26.139,241.214,26.139z M375.305,427.312c0,15.978-13,28.979-28.973,28.979H136.096
			c-15.973,0-28.973-13.002-28.973-28.979V170.861h268.182V427.312z M410.135,115.744c0,15.978-13,28.979-28.973,28.979H101.266
			c-15.973,0-28.973-13.001-28.973-28.979v-2.828c0-15.978,13-28.979,28.973-28.979h279.897c15.973,0,28.973,13.001,28.973,28.979
			V115.744z"/>
                                            <path d="M171.144,422.863c7.218,0,13.069-5.853,13.069-13.068V262.641c0-7.216-5.852-13.07-13.069-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C158.074,417.012,163.926,422.863,171.144,422.863z"/>
                                            <path d="M241.214,422.863c7.218,0,13.07-5.853,13.07-13.068V262.641c0-7.216-5.854-13.07-13.07-13.07
			c-7.217,0-13.069,5.854-13.069,13.07v147.154C228.145,417.012,233.996,422.863,241.214,422.863z"/>
                                            <path d="M311.284,422.863c7.217,0,13.068-5.853,13.068-13.068V262.641c0-7.216-5.852-13.07-13.068-13.07
			c-7.219,0-13.07,5.854-13.07,13.07v147.154C298.213,417.012,304.067,422.863,311.284,422.863z"/>
                                        </g>
                                    </g>
                                </svg>



                            </button>


                    </div>

                </div>

            </div>
            <div className="publication-block-bottom">
                <p>{description}</p>
            </div>
        </div>);

}


function News({ title, image, description }) {
    return (
        <div className="publication-block">


            <div className="publication-block-top news-top">

                <div className="publication-img">
                    <img src={image} alt="logo"></img>
                </div>


                <div className="publication-title">

                    <h3>{title}</h3>

                </div>

            </div>
            <div className="publication-block-bottom">
                <p>{description}</p>
            </div>
        </div>);

}



function Home() {
    const [page, setPage] = useState(0);
    const navigate = useNavigate(); 
    const username = "test";
    const id = "1";
    const shareUrl = `/share/${username}/${id}`;

    const copyShareLink = () => {
        const fullUrl = `${window.location.origin}${shareUrl}`;
        navigator.clipboard.writeText(fullUrl);
        navigate(shareUrl);
    };

    return (
        <>
            <header>
                <div className="header-content">
                    <div className="logo-block">
                        <img src={mainLogo} alt="logo"></img>
                    </div>
                    <div className="landing-menu">
                        <button
                            className={page === 0 ? "button-active" : ""}
                            type="button"
                            onClick={() => setPage(0)}
                        >
                            NEWS
                        </button>
                        <button
                            className={page === 1 ? "button-active" : ""}
                            type="button"
                            onClick={() => setPage(1)}
                        >
                            PORTFOLIOS
                        </button>
                    </div>
                    <div className="register-section share">
                        <button onClick={copyShareLink}>
                            SHARE
                        </button>
                    </div>


                    <div className="register-section">
                        {/* Username is needed there */}
                        <p>USERNAMEPLACEHOLDER</p>
                        <Link to="/">
                            <svg width="20px" height="20px" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M730.56 928h-640v-288a32 32 0 1 0-64 0v320a32 32 0 0 0 32 32h672a32 32 0 0 0 0-64zM58.56 544a32 32 0 0 0 32-32v-128a32 32 0 1 0-64 0v128a32 32 0 0 0 32 32zM46.4 285.44a32 32 0 0 0 12.16 2.56 32 32 0 0 0 12.16-2.56 29.76 29.76 0 0 0 10.56-6.72 32 32 0 0 0 6.72-34.88 29.76 29.76 0 0 0-6.72-10.56 32 32 0 0 0-10.56-6.72A32 32 0 0 0 58.56 224a32 32 0 0 0-22.72 54.72 37.12 37.12 0 0 0 10.56 6.72zM58.56 160a32 32 0 0 0 32-32V96h640a32 32 0 0 0 0-64h-672a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32zM984.32 524.16a32 32 0 0 0-7.04-34.88l-224-224a32 32 0 0 0-45.12 45.12l169.28 169.6H314.56a32 32 0 1 0 0 64h562.88l-169.28 169.28a32 32 0 1 0 45.12 45.12l224-224a32 32 0 0 0 7.04-10.24z" fill="#231815" /></svg>
                        </Link>
                    </div>
                </div>
            </header>


            {/* News page */}
            <div className="landing-block">
                <div className={`landing-block-content ${page === 0 ? "active" : ""}`}>
                    <News title="Title Example" image={mainLogo} description="Aeneas was a robust guy, A kozak full of vim,Full of the devil, lewd and spry, There was no one like him.And when the Greeks had burned down Troy And made of it, to their great joy, A heap of dung, he left that waste Together with some Trojan tramps,The sun-tanned scamps.They all took to their heels in haste. Constructing his boats at great speed, He launched them on the bluish sea And filled them with the men he'd need As he sailed toward his destiny. But Juno, daughter of a bitch, A cackling hen with fighting itch, Loathed him for being proud and deft. She wished to see that his soul would Fly to the deuce for good,And no trace of him would be left." />

                </div>



                {/* Publications page */}
                <div className={`landing-block-content ${page === 1 ? "active" : ""}`}>
                    <Link to="/home/create">
                        <div className="add-publication">
                            <p>+</p>
                        </div>
                    </Link>
                    {/* Publications are packed in [Publication] function */}
                    {/* Since some data are closely  attached to DB, [user] field is not used so far, but you can access the content dynamicaly via args*/}
                    <Publication title="Title Example" image={mainLogo} description="Aeneas was a robust guy, A kozak full of vim,Full of the devil, lewd and spry, There was no one like him.And when the Greeks had burned down Troy And made of it, to their great joy, A heap of dung, he left that waste Together with some Trojan tramps,The sun-tanned scamps.They all took to their heels in haste. Constructing his boats at great speed, He launched them on the bluish sea And filled them with the men he'd need As he sailed toward his destiny. But Juno, daughter of a bitch, A cackling hen with fighting itch, Loathed him for being proud and deft. She wished to see that his soul would Fly to the deuce for good,And no trace of him would be left." user="test" />


                </div>


            </div >






        </>
    );
}

export default Home;
