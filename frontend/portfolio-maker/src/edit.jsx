import mainLogo from "./assets/icon-placeholder.svg";
import "./landing.css";
import "./home.css";
import "./edit.css";
import { Link, useParams } from "react-router-dom";
import { updatePublication } from "./services/publications";

function Edit() {
  const { id } = useParams();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", e.target.title.value);
    data.append("description", e.target.desc.value);
    data.append("image", e.target.image.files[0]);

    try {
      await updatePublication(id, data);
      alert("updated successfully");
    } catch (err) {
      console.error(err);
      alert("Update failed");
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
            {/* Username is needed there */}
            <p>USERNAMEPLACEHOLDER</p>
          </div>
        </div>
      </header>

      <div className="landing-block">
        <div className="landing-block-content active">
          <div className="publication-block">
            <form onSubmit={handleSubmit}>
              <label for="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter title"
              />

              <label for="image">Image</label>
              <input type="file" id="image" name="image" accept="image/*" />

              <label for="desc">Description</label>
              <textarea
                id="desc"
                name="desc"
                rows="5"
                placeholder="Enter description"
              ></textarea>

              <div className="publication-button-section">
                <button className="green" type="submit">
                  Apply
                </button>
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

export default Edit;
