import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface HomePageProps {
  setCurrentPage: (page: "home" | "prebuilt" | "builder" | "catalog" | "cart" | "about" | "contact") => void;
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  const featuredProducts = useQuery(api.products.getFeaturedProducts);
  const prebuiltConfigs = useQuery(api.products.getPrebuiltConfigs, { featured: true });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-6 shadow-2xl">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-white mb-6">
                Power to the <span className="text-red-400">Builders</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Revolutionizing PC Building with cutting-edge technology, 
                transparent pricing, and uncompromising quality. 
                Join the electronics revolution.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage("prebuilt")}
                className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Shop Pre-Built PCs
              </button>
              <button
                onClick={() => setCurrentPage("builder")}
                className="px-8 py-4 bg-transparent border-2 border-red-500 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                Build Your Own
              </button>
            </div>
          </div>
        </div>
        
        {/* Animated Circuit Pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 200">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="#ef4444" strokeWidth="1"/>
                <circle cx="10" cy="10" r="2" fill="#ef4444"/>
                <circle cx="90" cy="90" r="2" fill="#ef4444"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>
      </section>

      {/* Featured Pre-Built PCs */}
      <section className="py-16 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Builds</h2>
            <p className="text-gray-300">Hand-crafted systems for every need and budget</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prebuiltConfigs?.slice(0, 4).map((config) => (
              <div key={config._id} className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 p-6 hover:border-red-500/60 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{config.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{config.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-400">${config.price.toLocaleString()}</span>
                    {config.originalPrice && (
                      <span className="text-gray-500 line-through">${config.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gaming</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(config.performanceScores.gaming / 20) ? 'text-red-400' : 'text-gray-600'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Productivity</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-xs ${i < Math.floor(config.performanceScores.productivity / 20) ? 'text-red-400' : 'text-gray-600'}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentPage("prebuilt")}
              className="px-6 py-3 bg-transparent border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
            >
              View All Pre-Built PCs
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose PRE */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose PRE?</h2>
            <p className="text-gray-300">Revolutionary approach to PC building</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cutting-Edge Performance</h3>
              <p className="text-gray-300">
                Latest components and optimized configurations for maximum performance in gaming, 
                content creation, and professional workloads.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Quality Guaranteed</h3>
              <p className="text-gray-300">
                Rigorous testing, premium components, and comprehensive warranties. 
                Every system is built to last and perform flawlessly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4V8a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Expert Support</h3>
              <p className="text-gray-300">
                Dedicated support team of PC building experts ready to help with 
                configuration, troubleshooting, and upgrades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600/20 to-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join the Revolution?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start building your dream PC today with PRE's revolutionary platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage("builder")}
              className="px-8 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Start Custom Build
            </button>
            <button
              onClick={() => setCurrentPage("catalog")}
              className="px-8 py-4 bg-transparent border border-red-500 text-red-400 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              Browse Components
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
