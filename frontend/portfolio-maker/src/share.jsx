import { useState } from "react";
import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";

import { Link, useParams } from "react-router-dom";



function Publication({ title, image, description }) {
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
                </div>

            </div>
            <div className="publication-block-bottom">
                <p>{description}</p>
            </div>
        </div>);

}




function Share() {
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


            {/* News page */}
            <div className="landing-block">

                {/* Publications page */}
                <div className="landing-block-content active">
                    {/* Publications are packed in [Publication] function */}
                    {/* Since some data are closely  attached to DB, [user] field is not used so far, but you can access the content dynamicaly via args*/}
                    
                    <Publication title="Title Example" image={mainLogo} description="Aeneas was a robust guy, A kozak full of vim,Full of the devil, lewd and spry, There was no one like him.And when the Greeks had burned down Troy And made of it, to their great joy, A heap of dung, he left that waste Together with some Trojan tramps,The sun-tanned scamps.They all took to their heels in haste. Constructing his boats at great speed, He launched them on the bluish sea And filled them with the men he'd need As he sailed toward his destiny. But Juno, daughter of a bitch, A cackling hen with fighting itch, Loathed him for being proud and deft. She wished to see that his soul would Fly to the deuce for good,And no trace of him would be left." user="test" />

                </div>


            </div >



        </>
    );
}

export default Share;
