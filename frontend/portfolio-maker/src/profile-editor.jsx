import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "./services/publications";
import { getMediaUrl } from "./utils/helpers";

const EMPTY_SOCIAL_LINK = { platform: "", url: "" };
const EMPTY_EXPERIENCE = {
  job_title: "",
  company: "",
  duration: "",
  responsibilities: "",
};
const EMPTY_EDUCATION = {
  degree: "",
  institution: "",
  graduation_date: "",
};
const EMPTY_ACHIEVEMENT = {
  title: "",
  details: "",
};
const EMPTY_CERTIFICATION = {
  name: "",
  issuer: "",
  date: "",
  details: "",
};
const EMPTY_TESTIMONIAL = {
  name: "",
  position: "",
  recommendation: "",
};

function cloneTemplate(template) {
  return { ...template };
}

function normalizeObjectList(listValue, template) {
  if (!Array.isArray(listValue) || listValue.length === 0) {
    return [cloneTemplate(template)];
  }

  return listValue.map((entry) => {
    const normalized = cloneTemplate(template);
    if (entry && typeof entry === "object") {
      Object.keys(normalized).forEach((key) => {
        normalized[key] = String(entry[key] || "");
      });
    }
    return normalized;
  });
}

function normalizeSocialLinks(listValue) {
  if (!Array.isArray(listValue) || listValue.length === 0) {
    return [cloneTemplate(EMPTY_SOCIAL_LINK)];
  }

  return listValue.map((entry) => {
    if (typeof entry === "string") {
      return { platform: "Link", url: entry };
    }
    return {
      platform: String(entry?.platform || ""),
      url: String(entry?.url || ""),
    };
  });
}

function parseCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function filterObjectList(listValue) {
  return listValue.filter((entry) =>
    Object.values(entry).some((fieldValue) => String(fieldValue).trim() !== ""),
  );
}

function ProfileEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [existingPhoto, setExistingPhoto] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    contact_email: "",
    phone: "",
    location: "",
    summary: "",
    professional_philosophy: "",
    career_objectives: "",
    technical_skills_text: "",
    soft_skills_text: "",
    hobbies_text: "",
    photo: null,
    social_links: [cloneTemplate(EMPTY_SOCIAL_LINK)],
    work_experience: [cloneTemplate(EMPTY_EXPERIENCE)],
    education: [cloneTemplate(EMPTY_EDUCATION)],
    achievements: [cloneTemplate(EMPTY_ACHIEVEMENT)],
    certifications: [cloneTemplate(EMPTY_CERTIFICATION)],
    testimonials: [cloneTemplate(EMPTY_TESTIMONIAL)],
  });

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const profile = await getMyProfile();
        setFormData((currentData) => ({
          ...currentData,
          full_name: profile.full_name || "",
          contact_email: profile.contact_email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          summary: profile.summary || "",
          professional_philosophy: profile.professional_philosophy || "",
          career_objectives: profile.career_objectives || "",
          technical_skills_text: Array.isArray(profile.technical_skills)
            ? profile.technical_skills.join(", ")
            : "",
          soft_skills_text: Array.isArray(profile.soft_skills)
            ? profile.soft_skills.join(", ")
            : "",
          hobbies_text: Array.isArray(profile.hobbies) ? profile.hobbies.join(", ") : "",
          social_links: normalizeSocialLinks(profile.social_links),
          work_experience: normalizeObjectList(profile.work_experience, EMPTY_EXPERIENCE),
          education: normalizeObjectList(profile.education, EMPTY_EDUCATION),
          achievements: normalizeObjectList(profile.achievements, EMPTY_ACHIEVEMENT),
          certifications: normalizeObjectList(profile.certifications, EMPTY_CERTIFICATION),
          testimonials: normalizeObjectList(profile.testimonials, EMPTY_TESTIMONIAL),
        }));
        setExistingPhoto(getMediaUrl(profile.photo || ""));
      } catch (apiError) {
        console.error("Profile loading error:", apiError);
        setError(apiError.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Loading timed out. Please refresh the page.");
      }
    }, 10000); // 10 second timeout

    loadProfile();

    return () => clearTimeout(timeoutId);
  }, []);

  const sectionCompletion = useMemo(() => {
    const checks = [
      Boolean(formData.full_name.trim()),
      Boolean(formData.summary.trim()),
      filterObjectList(formData.work_experience).length > 0,
      filterObjectList(formData.education).length > 0,
      parseCommaList(formData.technical_skills_text).length > 0,
      filterObjectList(formData.achievements).length > 0,
      filterObjectList(formData.testimonials).length > 0,
      Boolean(formData.professional_philosophy.trim() || formData.career_objectives.trim()),
      parseCommaList(formData.hobbies_text).length > 0,
    ];
    return checks.filter(Boolean).length;
  }, [formData]);

  const handleFieldChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePhotoChange = (event) => {
    const nextPhoto = event.target.files?.[0] || null;
    setFormData((currentData) => ({
      ...currentData,
      photo: nextPhoto,
    }));
  };

  const handleArrayItemChange = (section, index, key, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [section]: currentData[section].map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [key]: value } : entry,
      ),
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData((currentData) => ({
      ...currentData,
      [section]: [...currentData[section], cloneTemplate(template)],
    }));
  };

  const removeArrayItem = (section, index, template) => {
    setFormData((currentData) => {
      if (currentData[section].length <= 1) {
        return {
          ...currentData,
          [section]: [cloneTemplate(template)],
        };
      }

      return {
        ...currentData,
        [section]: currentData[section].filter((_, entryIndex) => entryIndex !== index),
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = new FormData();
    payload.append("full_name", formData.full_name);
    payload.append("contact_email", formData.contact_email);
    payload.append("phone", formData.phone);
    payload.append("location", formData.location);
    payload.append("summary", formData.summary);
    payload.append("professional_philosophy", formData.professional_philosophy);
    payload.append("career_objectives", formData.career_objectives);
    payload.append(
      "social_links",
      JSON.stringify(filterObjectList(formData.social_links)),
    );
    payload.append(
      "work_experience",
      JSON.stringify(filterObjectList(formData.work_experience)),
    );
    payload.append("education", JSON.stringify(filterObjectList(formData.education)));
    payload.append(
      "technical_skills",
      JSON.stringify(parseCommaList(formData.technical_skills_text)),
    );
    payload.append("soft_skills", JSON.stringify(parseCommaList(formData.soft_skills_text)));
    payload.append(
      "achievements",
      JSON.stringify(filterObjectList(formData.achievements)),
    );
    payload.append(
      "certifications",
      JSON.stringify(filterObjectList(formData.certifications)),
    );
    payload.append(
      "testimonials",
      JSON.stringify(filterObjectList(formData.testimonials)),
    );
    payload.append("hobbies", JSON.stringify(parseCommaList(formData.hobbies_text)));

    if (formData.photo) {
      payload.append("photo", formData.photo);
    }

    try {
      const updatedProfile = await updateMyProfile(payload);
      setExistingPhoto(updatedProfile.photo || existingPhoto);
      setNotice("Portfolio profile saved.");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="editor-page">
        <section className="editor-shell">
          <p className="state-message">Loading profile...</p>
          {error && <div className="form-error">{error}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="editor-page">
      <section className="editor-shell">
        <div className="section-heading">
          <div>
            <p className="chip">Portfolio Profile</p>
            <h1>Edit your full portfolio content</h1>
            <p>{sectionCompletion}/9 sections completed</p>
          </div>
          <Link to="/dashboard" className="btn btn-text">
            Back to dashboard
          </Link>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <h2>Personal info</h2>
          <div className="form-grid-two">
            <div>
              <label htmlFor="full_name">Name</label>
              <input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleFieldChange}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label htmlFor="contact_email">Email</label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleFieldChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleFieldChange}
                placeholder="+1 000 000 0000"
              />
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleFieldChange}
                placeholder="City, Country"
              />
            </div>
          </div>

          <label htmlFor="photo">Profile photo</label>
          <input id="photo" name="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
          {existingPhoto ? <img src={getMediaUrl(existingPhoto)} alt="Current profile" className="editor-preview" /> : null}

          <div className="section-card">
            <div className="section-card-top">
              <h3>Social links</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("social_links", EMPTY_SOCIAL_LINK)}
              >
                Add link
              </button>
            </div>
            <div className="entry-list">
              {formData.social_links.map((item, index) => (
                <article className="entry-item compact" key={`social-${index}`}>
                  <input
                    value={item.platform}
                    onChange={(event) =>
                      handleArrayItemChange("social_links", index, "platform", event.target.value)
                    }
                    placeholder="Platform"
                  />
                  <input
                    value={item.url}
                    onChange={(event) =>
                      handleArrayItemChange("social_links", index, "url", event.target.value)
                    }
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("social_links", index, EMPTY_SOCIAL_LINK)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <h2>Summary</h2>
          <label htmlFor="summary">Short bio / professional summary</label>
          <textarea
            id="summary"
            name="summary"
            rows="4"
            value={formData.summary}
            onChange={handleFieldChange}
            placeholder="Who you are, what you build, and your specialization."
          />

          <div className="section-card">
            <div className="section-card-top">
              <h3>Work experience</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("work_experience", EMPTY_EXPERIENCE)}
              >
                Add role
              </button>
            </div>
            <div className="entry-list">
              {formData.work_experience.map((item, index) => (
                <article className="entry-item" key={`work-${index}`}>
                  <div className="form-grid-two">
                    <input
                      value={item.job_title}
                      onChange={(event) =>
                        handleArrayItemChange("work_experience", index, "job_title", event.target.value)
                      }
                      placeholder="Job title"
                    />
                    <input
                      value={item.company}
                      onChange={(event) =>
                        handleArrayItemChange("work_experience", index, "company", event.target.value)
                      }
                      placeholder="Company"
                    />
                    <input
                      value={item.duration}
                      onChange={(event) =>
                        handleArrayItemChange("work_experience", index, "duration", event.target.value)
                      }
                      placeholder="Duration"
                    />
                  </div>
                  <textarea
                    rows="3"
                    value={item.responsibilities}
                    onChange={(event) =>
                      handleArrayItemChange(
                        "work_experience",
                        index,
                        "responsibilities",
                        event.target.value,
                      )
                    }
                    placeholder="Responsibilities and impact"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("work_experience", index, EMPTY_EXPERIENCE)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-top">
              <h3>Education</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("education", EMPTY_EDUCATION)}
              >
                Add education
              </button>
            </div>
            <div className="entry-list">
              {formData.education.map((item, index) => (
                <article className="entry-item compact" key={`edu-${index}`}>
                  <input
                    value={item.degree}
                    onChange={(event) =>
                      handleArrayItemChange("education", index, "degree", event.target.value)
                    }
                    placeholder="Degree"
                  />
                  <input
                    value={item.institution}
                    onChange={(event) =>
                      handleArrayItemChange("education", index, "institution", event.target.value)
                    }
                    placeholder="Institution"
                  />
                  <input
                    value={item.graduation_date}
                    onChange={(event) =>
                      handleArrayItemChange("education", index, "graduation_date", event.target.value)
                    }
                    placeholder="Graduation date"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("education", index, EMPTY_EDUCATION)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <h2>Skills</h2>
          <label htmlFor="technical_skills_text">Technical skills (comma-separated)</label>
          <input
            id="technical_skills_text"
            name="technical_skills_text"
            value={formData.technical_skills_text}
            onChange={handleFieldChange}
            placeholder="React, Django, PostgreSQL"
          />

          <label htmlFor="soft_skills_text">Soft skills (comma-separated)</label>
          <input
            id="soft_skills_text"
            name="soft_skills_text"
            value={formData.soft_skills_text}
            onChange={handleFieldChange}
            placeholder="Leadership, Communication, Collaboration"
          />

          <div className="section-card">
            <div className="section-card-top">
              <h3>Achievements</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("achievements", EMPTY_ACHIEVEMENT)}
              >
                Add achievement
              </button>
            </div>
            <div className="entry-list">
              {formData.achievements.map((item, index) => (
                <article className="entry-item compact" key={`ach-${index}`}>
                  <input
                    value={item.title}
                    onChange={(event) =>
                      handleArrayItemChange("achievements", index, "title", event.target.value)
                    }
                    placeholder="Award or accomplishment title"
                  />
                  <textarea
                    rows="2"
                    value={item.details}
                    onChange={(event) =>
                      handleArrayItemChange("achievements", index, "details", event.target.value)
                    }
                    placeholder="Short details"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("achievements", index, EMPTY_ACHIEVEMENT)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-top">
              <h3>Certifications</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("certifications", EMPTY_CERTIFICATION)}
              >
                Add certification
              </button>
            </div>
            <div className="entry-list">
              {formData.certifications.map((item, index) => (
                <article className="entry-item" key={`cert-${index}`}>
                  <div className="form-grid-two">
                    <input
                      value={item.name}
                      onChange={(event) =>
                        handleArrayItemChange("certifications", index, "name", event.target.value)
                      }
                      placeholder="Certification"
                    />
                    <input
                      value={item.issuer}
                      onChange={(event) =>
                        handleArrayItemChange("certifications", index, "issuer", event.target.value)
                      }
                      placeholder="Issuer"
                    />
                    <input
                      value={item.date}
                      onChange={(event) =>
                        handleArrayItemChange("certifications", index, "date", event.target.value)
                      }
                      placeholder="Date"
                    />
                  </div>
                  <textarea
                    rows="2"
                    value={item.details}
                    onChange={(event) =>
                      handleArrayItemChange("certifications", index, "details", event.target.value)
                    }
                    placeholder="Certification notes"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("certifications", index, EMPTY_CERTIFICATION)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <div className="section-card">
            <div className="section-card-top">
              <h3>Testimonials / references</h3>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => addArrayItem("testimonials", EMPTY_TESTIMONIAL)}
              >
                Add testimonial
              </button>
            </div>
            <div className="entry-list">
              {formData.testimonials.map((item, index) => (
                <article className="entry-item" key={`test-${index}`}>
                  <div className="form-grid-two">
                    <input
                      value={item.name}
                      onChange={(event) =>
                        handleArrayItemChange("testimonials", index, "name", event.target.value)
                      }
                      placeholder="Name"
                    />
                    <input
                      value={item.position}
                      onChange={(event) =>
                        handleArrayItemChange("testimonials", index, "position", event.target.value)
                      }
                      placeholder="Position"
                    />
                  </div>
                  <textarea
                    rows="3"
                    value={item.recommendation}
                    onChange={(event) =>
                      handleArrayItemChange(
                        "testimonials",
                        index,
                        "recommendation",
                        event.target.value,
                      )
                    }
                    placeholder="Short recommendation"
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeArrayItem("testimonials", index, EMPTY_TESTIMONIAL)}
                  >
                    Remove
                  </button>
                </article>
              ))}
            </div>
          </div>

          <h2>Portfolio goals / about</h2>
          <label htmlFor="professional_philosophy">Professional philosophy</label>
          <textarea
            id="professional_philosophy"
            name="professional_philosophy"
            rows="4"
            value={formData.professional_philosophy}
            onChange={handleFieldChange}
            placeholder="What principles guide your work?"
          />

          <label htmlFor="career_objectives">Career objectives / personal statement</label>
          <textarea
            id="career_objectives"
            name="career_objectives"
            rows="4"
            value={formData.career_objectives}
            onChange={handleFieldChange}
            placeholder="Your goals and direction."
          />

          <h2>Hobbies</h2>
          <label htmlFor="hobbies_text">Hobbies (comma-separated)</label>
          <input
            id="hobbies_text"
            name="hobbies_text"
            value={formData.hobbies_text}
            onChange={handleFieldChange}
            placeholder="Photography, Hiking, Chess"
          />

          {error ? <p className="form-error">{error}</p> : null}
          {notice ? <p className="form-success">{notice}</p> : null}

          <div className="editor-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save portfolio profile"}
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

export default ProfileEditor;
