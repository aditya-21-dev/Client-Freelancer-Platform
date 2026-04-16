import Navbar from '../../components/landing/Navbar'
import HeroSection from '../../components/landing/HeroSection'
import StatsSection from '../../components/landing/StatsSection'
import FeaturesSection from '../../components/landing/FeaturesSection'
import ReviewsSection from '../../components/landing/ReviewsSection'
import Footer from '../../components/landing/Footer'

function Home() {
  return (
    <div className="bg-gray-50">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ReviewsSection />
      <Footer />
    </div>
  )
}

export default Home