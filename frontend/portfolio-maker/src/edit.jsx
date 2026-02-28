import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createPublication, getPublication, updatePublication } from "./services/publications";
import { getMediaUrl } from "./utils/helpers";

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Edit component mounted, ID:", id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    role: "",
    technologiesText: "",
    mediaLinksText: "",
    image: null,
  });
  const [existingImage, setExistingImage] = useState("");

  useEffect(() => {
    async function loadPublication() {
      console.log("Loading publication with ID:", id);
      setLoading(true);
      setError("");
      try {
        const publication = await getPublication(id);
        console.log("Publication loaded:", publication);
        setFormData({
          name: publication.name || "",
          description: publication.description || "",
          role: publication.role || "",
          technologiesText: Array.isArray(publication.technologies)
            ? publication.technologies.join(", ")
            : "",
          mediaLinksText: Array.isArray(publication.media_links)
            ? publication.media_links.join("\n")
            : "",
          image: null,
        });
        setExistingImage(publication.image || "");
        console.log("Form data set, existing image:", publication.image);
      } catch (apiError) {
        console.error("Publication loading error:", apiError);
        setError(apiError.message || "Failed to load project");
      } finally {
        console.log("Loading completed");
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout triggered");
        setLoading(false);
        setError("Loading timed out. Please refresh the page.");
      }
    }, 10000); // 10 second timeout

    loadPublication();

    return () => clearTimeout(timeoutId);
  }, [id]);

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
    setSaving(true);

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
      await updatePublication(id, payload);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    console.log("Edit component: showing loading state");
    return (
      <main className="editor-page">
        <section className="editor-shell">
          <p className="state-message">Loading project...</p>
          {error && <div className="form-error">{error}</div>}
        </section>
      </main>
    );
  }

  console.log("Edit component: rendering form, loading:", loading, "error:", error);

  return (
    <main className="editor-page">
      <section className="editor-shell">
        <div className="section-heading">
          <div>
            <p className="chip">Edit project</p>
            <h1>Refine your portfolio entry</h1>
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
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="image">Replace image (optional)</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />

          {existingImage ? (
            <img src={getMediaUrl(existingImage)} alt={formData.name || "Current project"} className="editor-preview" />
          ) : null}

          <label htmlFor="description">Project description</label>
          <textarea
            id="description"
            name="description"
            rows="8"
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
            placeholder="Your role in this project"
          />

          <label htmlFor="technologiesText">Technologies / tools (comma-separated)</label>
          <input
            id="technologiesText"
            name="technologiesText"
            value={formData.technologiesText}
            onChange={handleInputChange}
            placeholder="React, Django, Figma"
          />

          <label htmlFor="mediaLinksText">Media links (one URL per line)</label>
          <textarea
            id="mediaLinksText"
            name="mediaLinksText"
            rows="4"
            value={formData.mediaLinksText}
            onChange={handleInputChange}
            placeholder="https://demo.example.com"
          />

          {error ? <p className="form-error">{error}</p> : null}

          <div className="editor-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
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

export default Edit;
