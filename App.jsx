import React from "react";
import Home from "./Home"; // Ensure this component exists
import './home.css'; // Corrected the CSS path (relative import)
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <center>
      <nav>
        
          <Link to="/home">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        
      </nav>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
      </center>
    </Router>
    
  );
}

export default App;
