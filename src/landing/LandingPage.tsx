import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureGrid from "./components/FeatureGrid";
import ValueProps from "./components/ValueProps";
import { ActivityStrip } from "./components/ActivityStrip";
import DownloadSection from "./components/DownloadSection";
import Footer from "./components/Footer";

function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <ValueProps />
        <ActivityStrip />
        <DownloadSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
