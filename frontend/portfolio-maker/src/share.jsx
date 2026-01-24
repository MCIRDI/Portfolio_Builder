import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "./Context/AppContext";
import { getUserPublications } from "./services/publications";
import mainLogo from "./assets/icon-placeholder.svg";

function Share() {
  const { user } = useContext(AppContext);
  const { userId } = useParams();
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    async function fetchPublications() {
      try {
        const response = await getUserPublications(userId);
        setPublications(response);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
      }
    }
    fetchPublications();
  }, [userId]);

  const Publication = ({ title, image, description }) => (
    <div style={styles.publicationBlock}>
      <div style={styles.publicationTop}>
        <div style={styles.publicationImg}>
          <img src={image} alt={title} style={styles.image} />
        </div>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <p style={styles.description}>{description}</p>
    </div>
  );

  return (
    <div>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoBlock}>
            <img src={mainLogo} alt="logo" style={styles.logo} />
          </div>
          <p style={styles.tagline}>Made with PortfolioMaker</p>
          <p>{user ? user.username : "Loading..."}</p>
        </div>
      </header>

      <main style={styles.main}>
        {publications.length > 0 ? (
          publications.map((pub) => (
            <Publication
              key={pub.id}
              title={pub.name}
              image={pub.image || mainLogo}
              description={pub.description}
            />
          ))
        ) : (
          <p style={styles.noPublications}>No publications yet.</p>
        )}
      </main>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: "#fff",
    padding: "1rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
  },
  logoBlock: {},
  logo: {
    height: "50px",
    width: "auto",
  },
  tagline: {
    fontStyle: "italic",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "2rem",
  },
  publicationBlock: {
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
  },
  publicationTop: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1rem",
  },
  publicationImg: {
    width: "100%",
    borderRadius: "10px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
  },
  title: {
    marginTop: "0.5rem",
    textAlign: "center",
    fontSize: "1.2rem",
  },
  description: {
    padding: "1rem",
    fontSize: "0.95rem",
    color: "#333",
  },
  noPublications: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#666",
  },
};

export default Share;
