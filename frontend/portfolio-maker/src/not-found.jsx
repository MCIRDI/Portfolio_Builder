import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <p className="chip">404</p>
        <h1>Page not found</h1>
        <p>This view does not exist in the new portfolio builder flow.</p>
        <Link to="/" className="btn btn-primary">
          Return to homepage
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
