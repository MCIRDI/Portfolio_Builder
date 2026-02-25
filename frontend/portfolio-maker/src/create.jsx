import { Link, useNavigate } from "react-router-dom";
import { createPublication } from "./services/publications";
import { useState } from "react";

function Create() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    role: "",
    technologiesText: "",
    mediaLinksText: "",
    image: null,
  });

  const handleInputChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setFormData((currentData) => ({
      ...currentData,
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("role", formData.role);
    payload.append(
      "technologies",
      JSON.stringify(
        formData.technologiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
    payload.append(
      "media_links",
      JSON.stringify(
        formData.mediaLinksText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      await createPublication(payload);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editor-page">
      <section className="editor-shell">
        <div className="section-heading">
          <div>
            <p className="chip">Create project</p>
            <h1>Add a new portfolio story</h1>
          </div>
          <Link to="/dashboard" className="btn btn-text">
            Back to dashboard
          </Link>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Project title</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Example: Fintech Mobile Redesign"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="image">Cover image (optional)</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />

          <label htmlFor="description">Project description</label>
          <textarea
            id="description"
            name="description"
            rows="8"
            placeholder="Describe your role, process, and outcomes."
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="role">Your role</label>
          <input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Product Designer, Full-Stack Developer, etc."
          />

          <label htmlFor="technologiesText">Technologies / tools (comma-separated)</label>
          <input
            id="technologiesText"
            name="technologiesText"
            value={formData.technologiesText}
            onChange={handleInputChange}
            placeholder="React, Django, Figma, AWS"
          />

          <label htmlFor="mediaLinksText">Media links (one URL per line)</label>
          <textarea
            id="mediaLinksText"
            name="mediaLinksText"
            rows="4"
            value={formData.mediaLinksText}
            onChange={handleInputChange}
            placeholder="https://demo.example.com&#10;https://github.com/your-project"
          />

          {error ? <p className="form-error">{error}</p> : null}

          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Publish project"}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Create;
