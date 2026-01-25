import { useState } from "react";
import mainLogo from "./assets/logo.svg";
import landing1 from "./assets/image-landing-1.png";
import landing2 from "./assets/image-landing-2.png";
import landing3 from "./assets/image-landing-3.png";
import landing4 from "./assets/image-landing-4.png";
import landing5 from "./assets/image-landing-5.png";
import landing6 from "./assets/image-landing-6.png";

import "./landing.css";
import { Link } from "react-router-dom";

function Landing() {
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
                        <Link to="/register">
                            <button>Sign in</button>
                        </Link>
                    </div>
                </div>
            </header>
            <div className="landing-block">
                <div className={`landing-block-content ${page === 0 ? "active" : ""}`}>
                    <div className="landing-text-image">
                        <div className="landing-text-home">
                            <h1>Welcome to PortfolioMaker!</h1>
                            <p>
                                Looking for apealing portfolio? You are in the right place! We
                                offer high customization abilities and hosting.
                            </p>
                        </div>
                        <div className="landing-image-home">
                            <img src={landing1} alt="land1"></img>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Explore services today!</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>

                    <div className="landing-text-image">
                        <div className="landing-image-home">
                            <img src={landing2} alt="land2"></img>
                        </div>
                        <div className="landing-text-home">
                            <h1>Where to start?</h1>
                            <p>
                                Firstly create your account. We offer our services only to
                                registered users.{" "}
                            </p>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Create account!</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className={`landing-block-content ${page === 1 ? "active" : ""}`}>
                    <div className="landing-text-image">
                        <div className="landing-image-home">
                            <img src={landing3} alt="land3"></img>
                        </div>
                        <div className="landing-text-home">
                            <h1>Easy-to-use constructor!</h1>
                            <p>
                                Do not know how to use tool? Don`t worry! Interface of editor
                                can be handled easily without hundred paged guides!{" "}
                            </p>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Start now!</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>

                    <div className="landing-text-image">
                        <div className="landing-text-home">
                            <h1>Wide customization abilities!</h1>
                            <p>
                                Tool is provided with many basic templates. The variaty may be
                                expanded by user templates.
                            </p>
                        </div>
                        <div className="landing-image-home">
                            <img src={landing4} alt="land4"></img>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Create new portfolio!</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className={`landing-block-content ${page === 2 ? "active" : ""}`}>
                    <div className="landing-text-image">
                        <div className="landing-text-home">
                            <h1>Deploy your portfolio on platform!</h1>
                            <p>
                                In case you forgot to take portfolio on job interview, you
                                always can rely on our service! After creation, your portfolio
                                may be seen by anybody you wish
                            </p>
                        </div>
                        <div className="landing-image-home">
                            <img src={landing5} alt="landd5"></img>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Create portfolio</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>

                    <div className="landing-text-image">
                        <div className="landing-image-home">
                            <img src={landing6} alt="land6"></img>
                        </div>
                        <div className="landing-text-home">
                            <h1>Privacy</h1>
                            <p>
                                If you don`t want to publish your work, than you can download it
                                or leave on web application. We guarantee security of user
                                information
                            </p>
                        </div>
                    </div>

                    <div className="landing-text-address">
                        <a href="/register">Create account!</a>
                        <a href="/register" className="landing-arrow">
                            <svg
                                width="800px"
                                height="800px"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
                                    fill="#4c04b8"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <footer>
                <div className="footer-content">
                    <p>&copy; 2025 PortfolioMaker. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Landing;
