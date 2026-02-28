import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicProfile, getUserPublications } from "./services/publications";
import { getMediaUrl } from "./utils/helpers";
import iconPlaceholder from "./assets/icon-placeholder.svg";

function SectionList({ id, title, subtitle, items, renderItem }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="pf-section" id={id}>
      <h2 className="pf-section-title">{title}</h2>
      {subtitle ? <p className="pf-section-subtitle">{subtitle}</p> : null}
      <div className="pf-list">{items.map(renderItem)}</div>
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

  const displayName = profile?.full_name || profile?.username || "Portfolio Owner";
  const headline = profile?.summary?.split(".")[0] || "I build things that matter.";

  if (loading) {
    return (
      <main className="pf-page">
        <div className="pf-loading">
          <div className="pf-spinner" />
          <p>Loading portfolio...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pf-page">
      <nav className="pf-nav">
        <Link to="/" className="pf-nav-brand">
          Portfolio Forge
        </Link>
        <div className="pf-nav-links">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
          <button className="pf-btn pf-btn-outline" type="button" onClick={handleShare}>
            Share page
          </button>
        </div>
      </nav>

      <div className="pf-content">
        {error ? (
          <div className="pf-error">
            {error}
          </div>
        ) : null}

        <header className="pf-hero">
          <div className="pf-hero-inner">
            <p className="pf-hero-greeting">👋 Hey, I&apos;m {displayName.split(" ")[0]}.</p>
            <h1 className="pf-hero-title">{headline}</h1>
            <div className="pf-hero-actions">
              <a href="#experience" className="pf-btn pf-btn-primary">
                More about me
              </a>
              {(profile?.contact_email || profile?.phone) ? (
                <a
                  href={profile?.contact_email ? `mailto:${profile.contact_email}` : `tel:${profile?.phone}`}
                  className="pf-btn pf-btn-outline"
                >
                  Get in touch
                </a>
              ) : null}
            </div>
          </div>
          {profile?.photo ? (
            <div className="pf-hero-photo">
              <img src={getMediaUrl(profile.photo)} alt={displayName} />
            </div>
          ) : null}
        </header>

        {publications.length > 0 ? (
          <section className="pf-section" id="projects">
            <h2 className="pf-section-title">Featured Projects</h2>
            <p className="pf-section-subtitle">
              A selection of projects I&apos;ve worked on.
            </p>
            <div className="pf-project-grid">
              {publications.map((pub, index) => (
                <article
                  className="pf-project-card"
                  key={pub.id}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="pf-project-image">
                    <img
                      src={getMediaUrl(pub.image) || iconPlaceholder}
                      alt={pub.name}
                    />
                  </div>
                  <div className="pf-project-body">
                    <h3>{pub.name}</h3>
                    {pub.role ? (
                      <p className="pf-project-role">{pub.role}</p>
                    ) : null}
                    <p className="pf-project-desc">{pub.description}</p>
                    {Array.isArray(pub.technologies) && pub.technologies.length > 0 ? (
                      <div className="pf-tags">
                        {pub.technologies.map((tool, i) => (
                          <span key={`${pub.id}-${i}`} className="pf-tag">
                            {tool}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {Array.isArray(pub.media_links) && pub.media_links.length > 0 ? (
                      <div className="pf-project-links">
                        {pub.media_links.map((link, i) => (
                          <a
                            key={`${pub.id}-link-${i}`}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View project →
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {(Array.isArray(profile?.technical_skills) && profile.technical_skills.length > 0) ||
        (Array.isArray(profile?.soft_skills) && profile.soft_skills.length > 0) ? (
          <section className="pf-section">
            <h2 className="pf-section-title">My Tech Stack</h2>
            <p className="pf-section-subtitle">
              Technologies and tools I work with.
            </p>
            <div className="pf-tags pf-tags-large">
              {Array.isArray(profile?.technical_skills)
                ? profile.technical_skills.map((s, i) => (
                    <span key={`tech-${i}`} className="pf-tag">
                      {s}
                    </span>
                  ))
                : null}
              {Array.isArray(profile?.soft_skills)
                ? profile.soft_skills.map((s, i) => (
                    <span key={`soft-${i}`} className="pf-tag pf-tag-soft">
                      {s}
                    </span>
                  ))
                : null}
            </div>
          </section>
        ) : null}

        {profile?.summary ? (
          <section className="pf-section">
            <h2 className="pf-section-title">About me</h2>
            <p className="pf-about-text">{profile.summary}</p>
          </section>
        ) : null}

        <SectionList
          id="experience"
          title="Experience & Education"
          subtitle="My professional journey."
          items={[
            ...(Array.isArray(profile?.work_experience) ? profile.work_experience : []),
            ...(Array.isArray(profile?.education) ? profile.education : []),
          ].filter(
            (item) =>
              item &&
              typeof item === "object" &&
              Object.values(item).some((v) => v && String(v).trim()),
          )}
          renderItem={(item, index) => {
            const isEdu = "degree" in item && item.degree;
            return (
              <article className="pf-timeline-item" key={`item-${index}`}>
                <div className="pf-timeline-dot" />
                <div className="pf-timeline-content">
                  <h3>{isEdu ? item.degree : item.job_title}</h3>
                  <p className="pf-timeline-meta">
                    {isEdu ? item.institution : item.company}
                    {item.duration || item.graduation_date
                      ? ` · ${item.duration || item.graduation_date}`
                      : ""}
                  </p>
                  {(item.responsibilities || item.details) ? (
                    <p>{item.responsibilities || item.details}</p>
                  ) : null}
                </div>
              </article>
            );
          }}
        />

        <SectionList
          title="Achievements"
          items={profile?.achievements}
          renderItem={(item, index) => (
            <article className="pf-card" key={`ach-${index}`}>
              <h3>{item?.title}</h3>
              <p>{item?.details}</p>
            </article>
          )}
        />

        <SectionList
          title="Certifications"
          items={profile?.certifications}
          renderItem={(item, index) => (
            <article className="pf-card" key={`cert-${index}`}>
              <h3>{item?.name}</h3>
              <p className="pf-muted">{item?.issuer}</p>
              {item?.date ? <p className="pf-muted">{item.date}</p> : null}
              <p>{item?.details}</p>
            </article>
          )}
        />

        <SectionList
          title="What People Say"
          subtitle="Testimonials from colleagues and clients."
          items={profile?.testimonials}
          renderItem={(item, index) => (
            <article className="pf-testimonial" key={`test-${index}`}>
              <blockquote>&ldquo;{item?.recommendation}&rdquo;</blockquote>
              <div className="pf-testimonial-author">
                <span className="pf-testimonial-initials">
                  {(item?.name || "?")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <div>
                  <strong>{item?.name}</strong>
                  <span className="pf-muted">{item?.position}</span>
                </div>
              </div>
            </article>
          )}
        />

        {(profile?.professional_philosophy || profile?.career_objectives) ? (
          <section className="pf-section">
            <h2 className="pf-section-title">Goals & Philosophy</h2>
            <div className="pf-cards">
              {profile?.professional_philosophy ? (
                <article className="pf-card">
                  <h3>Professional philosophy</h3>
                  <p>{profile.professional_philosophy}</p>
                </article>
              ) : null}
              {profile?.career_objectives ? (
                <article className="pf-card">
                  <h3>Career objectives</h3>
                  <p>{profile.career_objectives}</p>
                </article>
              ) : null}
            </div>
          </section>
        ) : null}

        {Array.isArray(profile?.hobbies) && profile.hobbies.length > 0 ? (
          <section className="pf-section">
            <h2 className="pf-section-title">Hobbies</h2>
            <div className="pf-tags">
              {profile.hobbies.map((h, i) => (
                <span key={`hobby-${i}`} className="pf-tag">
                  {h}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="pf-section pf-contact" id="contact">
          <h2 className="pf-section-title">Let&apos;s build something amazing together</h2>
          <p className="pf-section-subtitle">
            Have a project in mind? I&apos;d love to hear about it.
          </p>
          <div className="pf-contact-actions">
            {profile?.contact_email ? (
              <a href={`mailto:${profile.contact_email}`} className="pf-btn pf-btn-primary">
                Send me an email
              </a>
            ) : null}
            {profile?.phone ? (
              <a href={`tel:${profile.phone}`} className="pf-btn pf-btn-outline">
                Give me a call
              </a>
            ) : null}
            {profile?.cv ? (
              <a href={getMediaUrl(profile.cv)} target="_blank" rel="noopener noreferrer" className="pf-btn pf-btn-outline">
                Download CV
              </a>
            ) : null}
            {Array.isArray(profile?.social_links) && profile.social_links.length > 0 ? (
              <div className="pf-social">
                {profile.social_links.map((link, i) => (
                  <a
                    key={i}
                    href={link?.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link?.platform || "Link"}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <footer className="pf-footer">
          <p>© {new Date().getFullYear()} {displayName}. Built with Portfolio Forge.</p>
          <Link to="/">Create your portfolio</Link>
        </footer>
      </div>
    </main>
  );
}

export default Share;
