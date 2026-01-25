import { useContext, useEffect, useState } from "react";
import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";
import {
  deletePublication,
  getUserPublications,
} from "./services/publications";
import { AppContext } from "./Context/AppContext";

function Publication() {
  const { user } = useContext(AppContext);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    const fetchPublications = async () => {
      if (user?.id) {
        const data = await getUserPublications(user.id);
        setPublications(data);
      }
    };
    fetchPublications();
  }, [user]);

  const handleDelete = async (id) => {
    await deletePublication(id);
    setPublications((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {publications.map((pub) => (
        <div
          key={pub.id}
          style={{
            background: "#eaeaea",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "16px",
            width: "100%",
            maxWidth: "700px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          {/* TOP */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
            }}
          >
            {/* IMAGE */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "10px",
                overflow: "hidden",
                background: "#222",
                flexShrink: 0,
              }}
            >
              <img
                src={pub.image}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* TITLE + BUTTONS */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <h3 style={{ margin: 0, color: "#000000", fontSize: "1.1rem" }}>
                {pub.name}
              </h3>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    background: "#2d6cdf",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(pub.id)}
                  style={{
                    background: "#d64545",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div style={{ marginTop: "10px" }}>
            <p
              style={{
                margin: 0,
                color: "#000000",
                fontSize: "0.9rem",
                lineHeight: 1.4,
              }}
            >
              {pub.description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
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
    </div>
  );
}

function Home() {
  const { user } = useContext(AppContext);

  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const shareUrl = `/share/${user?.id}`;

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
            <button onClick={copyShareLink}>SHARE</button>
          </div>

          <div className="register-section">
            {/* Username is needed there */}
            <p>USERNAMEPLACEHOLDER</p>
            <Link to="/">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 1024 1024"
                className="icon"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M730.56 928h-640v-288a32 32 0 1 0-64 0v320a32 32 0 0 0 32 32h672a32 32 0 0 0 0-64zM58.56 544a32 32 0 0 0 32-32v-128a32 32 0 1 0-64 0v128a32 32 0 0 0 32 32zM46.4 285.44a32 32 0 0 0 12.16 2.56 32 32 0 0 0 12.16-2.56 29.76 29.76 0 0 0 10.56-6.72 32 32 0 0 0 6.72-34.88 29.76 29.76 0 0 0-6.72-10.56 32 32 0 0 0-10.56-6.72A32 32 0 0 0 58.56 224a32 32 0 0 0-22.72 54.72 37.12 37.12 0 0 0 10.56 6.72zM58.56 160a32 32 0 0 0 32-32V96h640a32 32 0 0 0 0-64h-672a32 32 0 0 0-32 32v64a32 32 0 0 0 32 32zM984.32 524.16a32 32 0 0 0-7.04-34.88l-224-224a32 32 0 0 0-45.12 45.12l169.28 169.6H314.56a32 32 0 1 0 0 64h562.88l-169.28 169.28a32 32 0 1 0 45.12 45.12l224-224a32 32 0 0 0 7.04-10.24z"
                  fill="#231815"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* News page */}
      <div className="landing-block">
        <div className={`landing-block-content ${page === 0 ? "active" : ""}`}>
          <News
            title="Title Example"
            image={mainLogo}
            description="Aeneas was a robust guy, A kozak full of vim,Full of the devil, lewd and spry, There was no one like him.And when the Greeks had burned down Troy And made of it, to their great joy, A heap of dung, he left that waste Together with some Trojan tramps,The sun-tanned scamps.They all took to their heels in haste. Constructing his boats at great speed, He launched them on the bluish sea And filled them with the men he'd need As he sailed toward his destiny. But Juno, daughter of a bitch, A cackling hen with fighting itch, Loathed him for being proud and deft. She wished to see that his soul would Fly to the deuce for good,And no trace of him would be left."
          />
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
          <Publication
            title="Title Example"
            image={mainLogo}
            description="Aeneas was a robust guy, A kozak full of vim,Full of the devil, lewd and spry, There was no one like him.And when the Greeks had burned down Troy And made of it, to their great joy, A heap of dung, he left that waste Together with some Trojan tramps,The sun-tanned scamps.They all took to their heels in haste. Constructing his boats at great speed, He launched them on the bluish sea And filled them with the men he'd need As he sailed toward his destiny. But Juno, daughter of a bitch, A cackling hen with fighting itch, Loathed him for being proud and deft. She wished to see that his soul would Fly to the deuce for good,And no trace of him would be left."
            user="test"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
