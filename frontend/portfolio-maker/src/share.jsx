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
  const hasSkills =
    (Array.isArray(profile?.technical_skills) && profile.technical_skills.length > 0) ||
    (Array.isArray(profile?.soft_skills) && profile.soft_skills.length > 0);
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

  const navSections = useMemo(() => {
    const s = [];
    if (publications.length > 0) s.push({ id: "projects", label: "Projects" });
    if (hasWorkExp) s.push({ id: "experience", label: "Experience" });
    s.push({ id: "contact", label: "Contact" });
    return s;
  }, [publications.length, hasWorkExp]);

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

        {hasSkills ? (
          <section className="pf-section pf-section-animate" id="tech">
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
