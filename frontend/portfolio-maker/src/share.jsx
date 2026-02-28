import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPublicUser, getPublications } from "./services/publications";
import { getMediaUrl } from "./utils/helpers";
import iconPlaceholder from "./assets/icon-placeholder.svg";

function SectionList({ title, items, renderItem }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="portfolio-section">
      <h2>{title}</h2>
      <div className="portfolio-list">{items.map(renderItem)}</div>
    </section>
  );
}

function Share() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPublicPortfolio() {
      setLoading(true);
      setError("");

      try {
        const [profileData, entries] = await Promise.all([
          getPublicProfile(userId),
          getUserPublications(userId),
        ]);

        setProfile(profileData);
        setPublications(entries);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPublicPortfolio();
  }, [userId]);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.full_name || profile?.username || "Portfolio"} on Portfolio Forge`,
          url,
        });
      } catch {
        setError("Share dialog was cancelled or blocked.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      setError("Clipboard permission is blocked in this browser.");
    }
  };

  if (loading) {
    return (
      <main className="portfolio-page">
        <div className="portfolio-shell">
          <p className="state-message">Loading portfolio...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="portfolio-page">
      <section className="portfolio-shell">
        <header className="portfolio-header">
          <div>
            <p className="chip">Public portfolio</p>
            <h1>{profile?.full_name || profile?.username || "Unknown user"}</h1>
            <p>{publications.length} projects published</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={handleShare}>
            Share page
          </button>
        </header>

        {error ? <p className="form-error">{error}</p> : null}

        <section className="portfolio-section">
          <h2>Personal info</h2>
          <div className="profile-hero-card">
            {profile?.photo ? <img src={getMediaUrl(profile.photo)} alt={profile.full_name || "Profile"} className="profile-photo" /> : null}
            <div>
              <h3>{profile?.full_name || profile?.username || "Portfolio Owner"}</h3>
              {profile?.contact_email ? <p>{profile.contact_email}</p> : null}
              {profile?.phone ? <p>{profile.phone}</p> : null}
              {profile?.location ? <p>{profile.location}</p> : null}
              {Array.isArray(profile?.social_links) && profile.social_links.length > 0 ? (
                <div className="social-links">
                  {profile.social_links.map((link, index) => (
                    <a
                      key={`${link?.url || "social"}-${index}`}
                      href={link?.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link?.platform || link?.url || "Social link"}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {profile?.summary ? (
          <section className="portfolio-section">
            <h2>Professional summary</h2>
            <p>{profile.summary}</p>
          </section>
        ) : null}

        <SectionList
          title="Work experience"
          items={profile?.work_experience}
          renderItem={(item, index) => (
            <article className="portfolio-item-card" key={`work-${index}`}>
              <h3>{item?.job_title || "Role"}</h3>
              <p>{item?.company || ""}</p>
              <p className="muted-line">{item?.duration || ""}</p>
              <p>{item?.responsibilities || ""}</p>
            </article>
          )}
        />

        <SectionList
          title="Education"
          items={profile?.education}
          renderItem={(item, index) => (
            <article className="portfolio-item-card" key={`edu-${index}`}>
              <h3>{item?.degree || "Degree"}</h3>
              <p>{item?.institution || ""}</p>
              <p className="muted-line">{item?.graduation_date || ""}</p>
            </article>
          )}
        />

        {Array.isArray(profile?.technical_skills) && profile.technical_skills.length > 0 ? (
          <section className="portfolio-section">
            <h2>Technical skills</h2>
            <div className="tag-list">
              {profile.technical_skills.map((skill, index) => (
                <span className="tag" key={`tech-${index}`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {Array.isArray(profile?.soft_skills) && profile.soft_skills.length > 0 ? (
          <section className="portfolio-section">
            <h2>Soft skills</h2>
            <div className="tag-list">
              {profile.soft_skills.map((skill, index) => (
                <span className="tag" key={`soft-${index}`}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="portfolio-section">
          <h2>Projects / work samples</h2>
          {publications.length === 0 ? (
            <div className="empty-state">
              <h3>No projects published yet</h3>
              <p>This profile is active but has no public project cards yet.</p>
            </div>
          ) : (
            <div className="project-grid">
              {publications.map((publication) => (
                <article className="project-card public" key={publication.id}>
                  <img
                    src={getMediaUrl(publication.image) || iconPlaceholder}
                    alt={publication.name}
                    className="project-thumb"
                  />
                  <div className="project-content">
                    <h3>{publication.name}</h3>
                    {publication.role ? <p className="muted-line">Role: {publication.role}</p> : null}
                    <p>{publication.description}</p>
                    {Array.isArray(publication.technologies) && publication.technologies.length > 0 ? (
                      <div className="tag-list">
                        {publication.technologies.map((tool, index) => (
                          <span className="tag" key={`${publication.id}-tool-${index}`}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {Array.isArray(publication.media_links) && publication.media_links.length > 0 ? (
                      <div className="media-links">
                        {publication.media_links.map((link, index) => (
                          <a key={`${publication.id}-media-${index}`} href={link} target="_blank" rel="noreferrer">
                            Media link {index + 1}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <SectionList
          title="Achievements"
          items={profile?.achievements}
          renderItem={(item, index) => (
            <article className="portfolio-item-card" key={`achievement-${index}`}>
              <h3>{item?.title || "Achievement"}</h3>
              <p>{item?.details || ""}</p>
            </article>
          )}
        />

        <SectionList
          title="Certifications"
          items={profile?.certifications}
          renderItem={(item, index) => (
            <article className="portfolio-item-card" key={`cert-${index}`}>
              <h3>{item?.name || "Certification"}</h3>
              <p>{item?.issuer || ""}</p>
              <p className="muted-line">{item?.date || ""}</p>
              <p>{item?.details || ""}</p>
            </article>
          )}
        />

        <SectionList
          title="Testimonials / references"
          items={profile?.testimonials}
          renderItem={(item, index) => (
            <article className="portfolio-item-card" key={`testimony-${index}`}>
              <h3>{item?.name || "Reference"}</h3>
              <p className="muted-line">{item?.position || ""}</p>
              <p>{item?.recommendation || ""}</p>
            </article>
          )}
        />

        {profile?.professional_philosophy || profile?.career_objectives ? (
          <section className="portfolio-section">
            <h2>Portfolio goals / about</h2>
            {profile?.professional_philosophy ? (
              <article className="portfolio-item-card">
                <h3>Professional philosophy</h3>
                <p>{profile.professional_philosophy}</p>
              </article>
            ) : null}
            {profile?.career_objectives ? (
              <article className="portfolio-item-card">
                <h3>Career objectives</h3>
                <p>{profile.career_objectives}</p>
              </article>
            ) : null}
          </section>
        ) : null}

        {Array.isArray(profile?.hobbies) && profile.hobbies.length > 0 ? (
          <section className="portfolio-section">
            <h2>Hobbies</h2>
            <div className="tag-list">
              {profile.hobbies.map((hobby, index) => (
                <span className="tag" key={`hobby-${index}`}>
                  {hobby}
                </span>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default Share;
