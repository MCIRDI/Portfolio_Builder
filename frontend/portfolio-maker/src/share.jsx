import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicProfile, getUserPublications } from "./services/publications";
import { getMediaUrl } from "./utils/helpers";
import iconPlaceholder from "./assets/icon-placeholder.svg";

function SectionList({ id, title, subtitle, items, renderItem }) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  return (
    <section className="pf-section pf-section-animate" id={id}>
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
  const [scrollPercent, setScrollPercent] = useState(0);

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
  const cvUrl = profile?.cv ? getMediaUrl(profile.cv) : null;

  const hasWorkExp =
    Array.isArray(profile?.work_experience) &&
    profile.work_experience.some(
      (i) => i && Object.values(i || {}).some((v) => v && String(v).trim()),
    );
  const hasEducation =
    Array.isArray(profile?.education) &&
    profile.education.some(
      (i) => i && Object.values(i || {}).some((v) => v && String(v).trim()),
    );
  const hasTechSkills = Array.isArray(profile?.technical_skills) && profile.technical_skills.length > 0;
  const hasSoftSkills = Array.isArray(profile?.soft_skills) && profile.soft_skills.length > 0;
  const hasAchievements =
    Array.isArray(profile?.achievements) && profile.achievements.length > 0;
  const hasCertifications =
    Array.isArray(profile?.certifications) && profile.certifications.length > 0;
  const hasTestimonials =
    Array.isArray(profile?.testimonials) && profile.testimonials.length > 0;
  const hasGoals =
    Boolean(profile?.professional_philosophy?.trim()) ||
    Boolean(profile?.career_objectives?.trim());
  const hasHobbies =
    Array.isArray(profile?.hobbies) && profile.hobbies.length > 0;

  const hasContact = profile?.contact_email || profile?.phone || (Array.isArray(profile?.social_links) && profile.social_links.length > 0);

  const navSections = useMemo(() => {
    const s = [];
    if (publications.length > 0) s.push({ id: "projects", label: "Projects" });
    if (hasWorkExp) s.push({ id: "experience", label: "Experience" });
    if (hasContact) s.push({ id: "contact", label: "Contact" });
    return s;
  }, [publications.length, hasWorkExp, hasContact]);

  const workItems = useMemo(
    () =>
      (Array.isArray(profile?.work_experience) ? profile.work_experience : []).filter(
        (i) => i && Object.values(i || {}).some((v) => v && String(v).trim()),
      ),
    [profile?.work_experience],
  );
  const eduItems = useMemo(
    () =>
      (Array.isArray(profile?.education) ? profile.education : []).filter(
        (i) => i && Object.values(i || {}).some((v) => v && String(v).trim()),
      ),
    [profile?.education],
  );

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
      setScrollPercent(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [loading]);

  useEffect(() => {
    if (loading || !profile) return;
    const sections = document.querySelectorAll(".pf-section-animate");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15, rootMargin: "-50px 0px -80px 0px" },
    );
    sections.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [loading, profile, publications.length]);

  if (loading) {
    return (
      <main className="pf-page pf-page-dark">
        <div className="pf-loading">
          <div className="pf-spinner" />
          <p>Loading portfolio...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="pf-page pf-page-dark">
      <div className="pf-progress-track">
        <div className="pf-progress-bar">
          <div
            className="pf-progress-fill"
            style={{ height: `${scrollPercent}%` }}
          />
        </div>
      </div>

      <div className="pf-hero-bg">
        <nav className="pf-nav">
          <span
            className="pf-nav-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {displayName}
          </span>
          <div className="pf-nav-links">
            {navSections.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <button className="pf-btn pf-btn-outline" type="button" onClick={handleShare}>
              Share page
            </button>
          </div>
        </nav>

        <div className="pf-content pf-hero-zone">
          {error ? <div className="pf-error">{error}</div> : null}

          <header className="pf-hero" id="hero">
            <div className="pf-hero-inner">
              <p className="pf-hero-greeting">👋 Hey, I&apos;m {displayName.split(" ")[0]}.</p>
              <h1 className="pf-hero-title">{headline}</h1>
              <div className="pf-hero-actions">
                <a
                  href={
                    hasWorkExp
                      ? "#experience"
                      : hasEducation
                        ? "#education"
                        : profile?.summary
                          ? "#about"
                          : "#contact"
                  }
                  className="pf-btn pf-btn-primary"
                >
                  More about me
                </a>
                {cvUrl ? (
                  <a
                    href={cvUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-btn pf-btn-outline"
                  >
                    Download my CV
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
        </div>
      </div>

      <div className="pf-content">
        {publications.length > 0 ? (
          <section className="pf-section pf-section-animate" id="projects">
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

        {Array.isArray(profile?.technical_skills) && profile.technical_skills.length > 0 ? (
          <section className="pf-section pf-section-animate" id="tech">
            <h2 className="pf-section-title">Tech Stack</h2>
            <p className="pf-section-subtitle">
              Technologies and tools I work with.
            </p>
            <div className="pf-tags pf-tags-large">
              {profile.technical_skills.map((s, i) => (
                <span key={`tech-${i}`} className="pf-tag">
                  {s}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {Array.isArray(profile?.soft_skills) && profile.soft_skills.length > 0 ? (
          <section className="pf-section pf-section-animate" id="soft-skills">
            <h2 className="pf-section-title">Soft Skills</h2>
            <p className="pf-section-subtitle">
              Interpersonal and communication abilities.
            </p>
            <div className="pf-tags pf-tags-large">
              {profile.soft_skills.map((s, i) => (
                <span key={`soft-${i}`} className="pf-tag pf-tag-soft">
                  {s}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {profile?.summary ? (
          <section className="pf-section pf-section-animate" id="about">
            <h2 className="pf-section-title">About me</h2>
            <p className="pf-about-text">{profile.summary}</p>
          </section>
        ) : null}

        {workItems.length > 0 ? (
          <SectionList
            id="experience"
            title="Experience"
            subtitle="My professional journey."
            items={workItems}
            renderItem={(item, index) => (
              <article className="pf-timeline-item" key={`work-${index}`}>
                <div className="pf-timeline-dot" />
                <div className="pf-timeline-content">
                  <h3>{item.job_title}</h3>
                  <p className="pf-timeline-meta">
                    {item.company}
                    {item.duration ? ` · ${item.duration}` : ""}
                  </p>
                  {item.responsibilities ? <p>{item.responsibilities}</p> : null}
                </div>
              </article>
            )}
          />
        ) : null}

        {eduItems.length > 0 ? (
          <SectionList
            id="education"
            title="Education"
            subtitle="Academic background."
            items={eduItems}
            renderItem={(item, index) => (
              <article className="pf-timeline-item" key={`edu-${index}`}>
                <div className="pf-timeline-dot" />
                <div className="pf-timeline-content">
                  <h3>{item.degree}</h3>
                  <p className="pf-timeline-meta">
                    {item.institution}
                    {item.graduation_date ? ` · ${item.graduation_date}` : ""}
                  </p>
                </div>
              </article>
            )}
          />
        ) : null}

        <SectionList
          id="achievements"
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
          id="certifications"
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
          id="testimonials"
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

        {hasGoals ? (
          <section className="pf-section pf-section-animate" id="goals">
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

        {hasHobbies ? (
          <section className="pf-section pf-section-animate" id="hobbies">
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
          <h2 className="pf-section-title">Let&apos;s connect</h2>
          <div className="pf-contact-icons">
            {profile?.contact_email ? (
              <a href={`mailto:${profile.contact_email}`} className="pf-contact-icon" title="Email">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            ) : null}
            {profile?.phone ? (
              <a href={`tel:${profile.phone}`} className="pf-contact-icon" title="Phone">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
              </a>
            ) : null}
            {Array.isArray(profile?.social_links) && profile.social_links.length > 0 ? (
              profile.social_links.map((link, i) => {
                const platform = (link?.platform || "").toLowerCase();
                const getIcon = (platform) => {
                  switch(platform) {
                    case 'instagram':
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                        </svg>
                      );
                    case 'facebook':
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      );
                    case 'linkedin':
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      );
                    case 'twitter':
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      );
                    case 'github':
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      );
                    default:
                      return (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      );
                  }
                };

                return (
                  <a
                    key={i}
                    href={link?.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="pf-contact-icon"
                    title={link?.platform || "Social Link"}
                  >
                    {getIcon(platform)}
                  </a>
                );
              })
            ) : null}
          </div>
        </section>

        <footer className="pf-footer">
          <p>© {new Date().getFullYear()} {displayName}. Built with Portfolio Builder.</p>
          <Link to="/">Create your portfolio</Link>
        </footer>
      </div>
    </main>
  );
}

export default Share;
