import "./App.css";

import Navbar from "./Pages/Navbar";
import HeroPage from "./Pages/HeroPage";
import Paste from "./Pages/Paste";
import Cards from "./Pages/Cards";
import Footer from "./Pages/Footer";

function App() {
  return (
    <div className="App">
      <div className="main">
        <Navbar />
        <HeroPage />
        <Paste />
        <Cards />
        <Footer />
      </div>
    </div>
  );
}

export default App;
