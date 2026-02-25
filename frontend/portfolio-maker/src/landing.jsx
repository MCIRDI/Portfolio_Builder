import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./Context/AppContext";

const features = [
  {
    title: "Fast Portfolio Builder",
    text: "Create and edit project cards in one clean dashboard, with no template lock-in.",
  },
  {
    title: "Share-Ready Pages",
    text: "Publish instantly with a dedicated public URL you can send to recruiters and clients.",
  },
  {
    title: "Simple Content Workflow",
    text: "Manage title, image, and story for each project with an editor built for speed.",
  },
];

const launchSteps = [
  "Create your account in under a minute.",
  "Add projects with strong visuals and concise descriptions.",
  "Share your public link and keep improving over time.",
];

function Landing() {
  const { token } = useContext(AppContext);

  return (
    <div className="landing-page">
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <h1>Portfolio Forge</h1>
            <p>Build your best professional story.</p>
          </div>
        </div>
        <nav>
          <a href="#features">Features</a>
          <a href="#launch">How it works</a>
          <Link to={token ? "/dashboard" : "/login"} className="btn btn-secondary">
            {token ? "Open dashboard" : "Sign in"}
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero stagger">
          <p className="chip">Modern portfolio builder</p>
          <h2>Turn your projects into a portfolio that feels premium.</h2>
          <p className="hero-subtitle">
            Portfolio Forge gives you a production-ready workflow: write, edit, arrange, and
            publish with a polished interface.
          </p>
          <div className="hero-actions">
            <Link to={token ? "/dashboard/new" : "/register"} className="btn btn-primary">
              Start building
            </Link>
            <Link to={token ? "/dashboard" : "/login"} className="btn btn-text">
              Explore dashboard
            </Link>
          </div>
        </section>

        <section className="feature-grid" id="features">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </section>

        <section className="launch-section" id="launch">
          <div>
            <p className="chip">Launch plan</p>
            <h3>Three steps to a live portfolio</h3>
          </div>
          <ol>
            {launchSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2026 Portfolio Forge</p>
        <Link to={token ? "/dashboard" : "/register"}>Create your portfolio</Link>
      </footer>
    </div>
  );
}

export default Landing;
