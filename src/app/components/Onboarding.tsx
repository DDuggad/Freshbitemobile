import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, MapPin, Package, Leaf, ChevronRight, ChevronLeft } from 'lucide-react';

const slides = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Find surplus pure veg food at discounted prices from restaurants near you in Bangalore',
    color: 'emerald',
  },
  {
    icon: Package,
    title: 'Reserve',
    description: 'Reserve your meal instantly and get confirmation. Pay the discounted price at pickup',
    color: 'green',
  },
  {
    icon: MapPin,
    title: 'Pickup',
    description: 'Pick up your food during the specified time window. Save money while reducing food waste',
    color: 'teal',
  },
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/app');
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigate('/app');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex flex-col">
      {/* Skip button */}
      <div className="p-4 text-right">
        <button
          onClick={handleSkip}
          className="text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md w-full animate-fade-in">
          {/* Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl">
            <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
          </div>

          {/* Eco badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Eco-Friendly</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">{slide.title}</h2>

          {/* Description */}
          <p className="text-lg text-emerald-700 leading-relaxed">{slide.description}</p>
        </div>
      </div>

      {/* Dots and navigation */}
      <div className="p-8">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-emerald-600'
                  : 'w-2 bg-emerald-200 hover:bg-emerald-300'
              }`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-emerald-200 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}