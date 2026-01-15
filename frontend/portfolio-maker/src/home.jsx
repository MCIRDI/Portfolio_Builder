import { useState } from "react";
import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";
import { Link } from "react-router-dom";

function Home() {
    const [page, setPage] = useState(0);
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
                            HOME
                        </button>
                        <button
                            className={page === 1 ? "button-active" : ""}
                            type="button"
                            onClick={() => setPage(1)}
                        >
                            CONSTRUCTOR
                        </button>
                        <button
                            className={page === 2 ? "button-active" : ""}
                            type="button"
                            onClick={() => setPage(2)}
                        >
                            PORTFOLIOS
                        </button>
                    </div>
                    <div className="register-section">
                        <p>USERNAMEPLACEHOLDER</p>
                        <svg width="20px" height="20px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M730.56 928h-640v-288a32 32 0 1 0-64 0v320a32 32 0 0 0 32 32h672a32 32 0 0 0 0-64zM58.56 544a32 32 0 0 0 32-32v-128a32 32 0 1 0-64 0v128a32 32 0 0 0 32 32zM46.4 285.44a32 32 0 0 0 12.16 2.56 32 32 0 0 0 12.16-2.56 29.76 29.76 0 0 0 10.56-6.72 32 32 0 0 0 6.72-34.88 29.76 29.76 0 0 0-6.72-10.56 32 32 0 0 0-10.56-6.72A32 32 0 0 0 58.56 224a32 32 0 0 0-22.72 54.72 37.12 37.12 0 0 0 10.56 6.72zM58.56 160a32 32 0 0 0 32-32V96h640a32 32 0 0 0 0-64h-672a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32zM984.32 524.16a32 32 0 0 0-7.04-34.88l-224-224a32 32 0 0 0-45.12 45.12l169.28 169.6H314.56a32 32 0 1 0 0 64h562.88l-169.28 169.28a32 32 0 1 0 45.12 45.12l224-224a32 32 0 0 0 7.04-10.24z" fill="#231815" /></svg>

                    </div>
                </div>
            </header>
            <div className="landing-block">
                <div className={`landing-block-content ${page === 0 ? "active" : ""}`}>

                </div>

                <div className={`landing-block-content ${page === 1 ? "active" : ""}`}>

                </div>

                <div className={`landing-block-content ${page === 2 ? "active" : ""}`}>

                </div>
            </div >
            <footer>
                <div className="footer-content">
                    <p>&copy; 2025 PortfolioMaker. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Home;
