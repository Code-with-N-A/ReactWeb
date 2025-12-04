// src/App.jsx
import { Route, Routes } from "react-router-dom";
import Nave from "./Nave";
import About from "./About";
import Home from "./home";
import Contact from "./Contact";
import SocialLinks from "./Sosalm";
import Footer from "./Footer";
import Blogs from "./Blogs";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";
import LandingPage from "./YouserAcoount";

function App() {
  return (
    <>
      <Nave />
      <SocialLinks />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/about"
          element={
              <About />
          }
        />
        <Route
          path="/blog"
          element={
            <ProtectedRoute>
              <Blogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
              <Contact />
          }
        />
zz
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-account" element={<LandingPage />} />

        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
