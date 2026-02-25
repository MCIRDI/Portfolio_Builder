import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import Landing from "./landing.jsx";
import Register from "./register.jsx";
import Login from "./login.jsx";
import Home from "./home.jsx";
import Share from "./share.jsx";
import Edit from "./edit.jsx";
import Create from "./create.jsx";
import ProfileEditor from "./profile-editor.jsx";
import NotFound from "./not-found.jsx";
import { AppContext } from "./Context/AppContext.jsx";

function FullPageLoader() {
  return (
    <div className="loading-page">
      <div className="loading-card">
        <span className="loading-spinner" />
        <p>Loading your workspace...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token, authLoading } = useContext(AppContext);

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { token, authLoading } = useContext(AppContext);

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function LegacyEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/dashboard/edit/${id}`} replace />;
}

function LegacyShareRedirect() {
  const { userId } = useParams();
  return <Navigate to={`/portfolio/${userId}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/new"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <ProfileEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit/:id"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />
        <Route path="/portfolio/:userId" element={<Share />} />

        {/* Backward-compatible routes */}
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/home/create" element={<Navigate to="/dashboard/new" replace />} />
        <Route path="/home/edit/:id" element={<LegacyEditRedirect />} />
        <Route path="/share/:userId" element={<LegacyShareRedirect />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
