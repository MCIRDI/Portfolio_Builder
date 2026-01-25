import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./landing.jsx";
import Register from "./register.jsx";
import Login from "./login.jsx";
import Home from "./home.jsx";
import Share from "./share.jsx";
import Edit from "./edit.jsx";
import Create from "./create.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/create" element={<Create />} />
        <Route path="/share/:userId" element={<Share />} />
        <Route path="/home/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
