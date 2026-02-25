import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import iconPlaceholder from "./assets/icon-placeholder.svg";
import { AppContext } from "./Context/AppContext";
import { deletePublication, getMyProfile, getMyPublications } from "./services/publications";

function Home() {
  const { user, logout } = useContext(AppContext);
  const [publications, setPublications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refreshPublications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const items = await getMyPublications();
      setPublications(items);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPublications();
  }, [refreshPublications]);

  useEffect(() => {
    async function loadProfile() {
      setProfileLoading(true);
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (apiError) {
        setError(apiError.message);
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, []);

  const totalWords = useMemo(
    () =>
      publications.reduce((counter, publication) => {
        const words = publication.description?.trim().split(/\s+/).filter(Boolean) || [];
        return counter + words.length;
      }, 0),
    [publications],
  );

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this project from your portfolio?");
    if (!shouldDelete) {
      return;
    }

    try {
      await deletePublication(id);
      setPublications((currentItems) => currentItems.filter((item) => item.id !== id));
      setNotice("Project removed successfully.");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleCopyPortfolioLink = async () => {
    if (!user?.id) {
      return;
    }

    const link = `${window.location.origin}/portfolio/${user.id}`;

    try {
      await navigator.clipboard.writeText(link);
      setNotice("Portfolio link copied to clipboard.");
    } catch {
      setError("Clipboard permission is blocked in this browser.");
    }
  };

  const profileCompletionCount = useMemo(() => {
    if (!profile) {
      return 0;
    }

    const checks = [
      Boolean(profile.full_name),
      Boolean(profile.summary),
      Array.isArray(profile.work_experience) && profile.work_experience.length > 0,
      Array.isArray(profile.education) && profile.education.length > 0,
      Array.isArray(profile.technical_skills) && profile.technical_skills.length > 0,
      Array.isArray(profile.achievements) && profile.achievements.length > 0,
      Array.isArray(profile.testimonials) && profile.testimonials.length > 0,
      Boolean(profile.professional_philosophy || profile.career_objectives),
      Array.isArray(profile.hobbies) && profile.hobbies.length > 0,
    ];

    return checks.filter(Boolean).length;
  }, [profile]);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="chip">Workspace</p>
          <h1>{user?.username}'s Portfolio</h1>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-secondary" type="button" onClick={handleCopyPortfolioLink}>
            Copy public link
          </button>
          <Link to={`/portfolio/${user?.id}`} className="btn btn-text">
            Preview public page
          </Link>
          <button className="btn btn-text" type="button" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-stats">
        <article>
          <h2>{publications.length}</h2>
          <p>Projects published</p>
        </article>
        <article>
          <h2>{totalWords}</h2>
          <p>Words in portfolio stories</p>
        </article>
        <article>
          <h2>{profile?.full_name || user?.username || "Profile"}</h2>
          <p>Portfolio owner</p>
        </article>
      </section>

      <section className="dashboard-list">
        <div className="section-heading">
          <div>
            <h2>Portfolio profile</h2>
            <p>
              Fill personal info, resume details, goals, testimonials, achievements, and hobbies.
            </p>
          </div>
          <Link to="/dashboard/profile" className="btn btn-primary">
            Edit profile sections
          </Link>
        </div>

        {profileLoading ? <p className="state-message">Loading profile sections...</p> : null}

        {!profileLoading ? (
          <div className="profile-quick-card">
            <p>{profileCompletionCount}/9 profile sections completed</p>
            <h3>{profile?.summary || "Add a short professional summary to strengthen your page."}</h3>
          </div>
        ) : null}
      </section>

      <section className="dashboard-list">
        <div className="section-heading">
          <div>
            <h2>Your projects</h2>
            <p>Keep each project concise, visual, and outcome-focused.</p>
          </div>
          <Link to="/dashboard/new" className="btn btn-primary">
            Add project
          </Link>
        </div>

        {notice ? <p className="form-success">{notice}</p> : null}
        {error ? <p className="form-error">{error}</p> : null}

        {loading ? <p className="state-message">Loading projects...</p> : null}

        {!loading && publications.length === 0 ? (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Add your first project to generate a share-ready portfolio URL.</p>
            <Link to="/dashboard/new" className="btn btn-primary">
              Create first project
            </Link>
          </div>
        ) : null}

        {!loading && publications.length > 0 ? (
          <div className="project-grid">
            {publications.map((publication) => (
              <article className="project-card" key={publication.id}>
                <img
                  src={publication.image || iconPlaceholder}
                  alt={publication.name}
                  className="project-thumb"
                />
                <div className="project-content">
                  <h3>{publication.name}</h3>
                  <p>{publication.description}</p>
                  {publication.role ? <p className="muted-line">Role: {publication.role}</p> : null}
                  {Array.isArray(publication.technologies) && publication.technologies.length > 0 ? (
                    <div className="tag-list">
                      {publication.technologies.map((tool) => (
                        <span key={`${publication.id}-${tool}`} className="tag">
                          {tool}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="project-actions">
                  <Link to={`/dashboard/edit/${publication.id}`} className="btn btn-secondary">
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDelete(publication.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Home;
