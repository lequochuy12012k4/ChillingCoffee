import Footer from "./components/client/Footer";
import Hero from "./components/client/HomeContext/HomeHero";
import HomeContext from "./components/client/HomeContext";
import Navbar from "./components/client/Navbar";

export default function Home() {
  return (
    <>
      <Navbar/>
      <HomeContext/>
      <Footer/>
    </>
  );
}
