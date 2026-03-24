import { Navigate } from "react-router-dom";
import { Hero } from "../features/landing/components/Hero";
import { FeatureSection } from "../features/landing/components/FeatureSection";
import { Navbar } from "../features/landing/components/Navbar";
import { Footer } from "../features/landing/components/Footer";
import { Pricing } from "../features/landing/components/Pricing";
import { useAuthContext } from "../context/useAuthContext";

const LandingPage: React.FC = () => {

  const { isAuth, loading } = useAuthContext();
  
  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="ml-4 text-gray-700">Loading...</p>
      </div>
    );


  if (isAuth) return <Navigate to="/dashboard" />;


  return (
    <div className="min-h-screen bg-gray-900 font-sans selection:bg-cyan-500/30">
      <Navbar />

      <div className="pt-20">
        <Hero />
      </div>

      {/* Feature 1 */}
      <FeatureSection
        title="Teamwork"
        subtitle="Collaborate with your Teammates"
        description="Assign tasks, share updates, and track progress together without the friction."
        imageNode={
          <img
            src="https://res.cloudinary.com/duxe6ofu7/image/upload/v1773842632/ChatGPT_Image_Mar_18_2026_07_31_35_PM_n7uncy.png"
            className="rounded-2xl h-full w-full object-fill  text-gray-500"
          />
        }
      />

      {/* Feature 2 (Reversed) */}
      <FeatureSection
        title="Communication"
        subtitle="Turn tasks into Conversations"
        description="Add context with files, comments, and reactions directly on the task."
        reverse={true}
        imageNode={
          <img
            src="https://res.cloudinary.com/duxe6ofu7/image/upload/v1773842632/ChatGPT_Image_Mar_18_2026_07_33_15_PM_njbzqc.png"
            className=" rounded-2xl h-full w-full object-cover flex items-center justify-center text-gray-500"
          />
        }
      />

      <Pricing />
      <Footer />
    </div>
  );
};

export default LandingPage;
