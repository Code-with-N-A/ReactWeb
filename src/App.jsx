import { Route, Routes } from "react-router-dom";
import Nave from "./Nave";
import About from "./About";
import Home from "./home";
import Contact from "./Contact";
import SocialLinks from "./Sosalm";
import Footer from "./Footer";

function App() {
  return(
    <>
    <Nave/>
    <SocialLinks/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='about' element={<About/>}/>
      <Route path='contact' element={<Contact/>}/>
    </Routes>
        <Footer/>

    </>
  )
};
export default App;