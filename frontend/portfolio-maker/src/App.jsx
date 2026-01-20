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

                {/*This one for static routing (debug)*/}v
                {/*<Route path="/share" element={<Share />}*/}


                {/*This one for dynamic routing*/}
                {/*(Yes, far from pefection, since we need to compare user data with DB)*/}
                <Route path="/share/:username/:id" element={<Share />} />

                <Route path="/home/edit/:id" element={<Edit />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
