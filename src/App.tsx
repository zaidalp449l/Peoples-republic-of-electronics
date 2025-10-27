import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { PreBuiltPCs } from "./components/PreBuiltPCs";
import { CustomBuilder } from "./components/CustomBuilder";
import { Cart } from "./components/Cart";
import { ProductCatalog } from "./components/ProductCatalog";

type Page = "home" | "prebuilt" | "builder" | "catalog" | "cart" | "about" | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const cartTotal = useQuery(api.cart.getCartTotal);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-red-500/30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentPage("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PRE</h1>
              <p className="text-xs text-red-400">Power to the Builders</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setCurrentPage("home")}
              className={`px-3 py-2 rounded transition-colors ${
                currentPage === "home" 
                  ? "bg-red-600 text-white" 
                  : "text-gray-300 hover:text-red-400"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage("prebuilt")}
              className={`px-3 py-2 rounded transition-colors ${
                currentPage === "prebuilt" 
                  ? "bg-red-600 text-white" 
                  : "text-gray-300 hover:text-red-400"
              }`}
            >
              Pre-Built PCs
            </button>
            <button
              onClick={() => setCurrentPage("builder")}
              className={`px-3 py-2 rounded transition-colors ${
                currentPage === "builder" 
                  ? "bg-red-600 text-white" 
                  : "text-gray-300 hover:text-red-400"
              }`}
            >
              Custom Builder
            </button>
            <button
              onClick={() => setCurrentPage("catalog")}
              className={`px-3 py-2 rounded transition-colors ${
                currentPage === "catalog" 
                  ? "bg-red-600 text-white" 
                  : "text-gray-300 hover:text-red-400"
              }`}
            >
              Components
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Authenticated>
              <button
                onClick={() => setCurrentPage("cart")}
                className="relative p-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartTotal && cartTotal.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartTotal.itemCount}
                  </span>
                )}
              </button>
              <SignOutButton />
            </Authenticated>
            <Unauthenticated>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Sign In
              </button>
            </Unauthenticated>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Content currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-red-500/30 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="text-white font-bold">PRE</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing Electronics for the People. 
                Empowering builders with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage("prebuilt")} className="hover:text-red-400">Pre-Built PCs</button></li>
                <li><button onClick={() => setCurrentPage("builder")} className="hover:text-red-400">Custom Builder</button></li>
                <li><button onClick={() => setCurrentPage("catalog")} className="hover:text-red-400">Components</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setCurrentPage("contact")} className="hover:text-red-400">Contact Us</button></li>
                <li><a href="#" className="hover:text-red-400">Warranty</a></li>
                <li><a href="#" className="hover:text-red-400">Returns</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-red-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-red-500/30 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 PRE - People's Republic of Electronics. Revolutionizing Electronics for the People.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function Content({ currentPage, setCurrentPage }: { 
  currentPage: string; 
  setCurrentPage: (page: Page) => void; 
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <>
      <Unauthenticated>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Join the Revolution
              </h1>
              <p className="text-gray-300">
                Sign in to access PRE's revolutionary PC building platform
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        {currentPage === "home" && <HomePage setCurrentPage={setCurrentPage} />}
        {currentPage === "prebuilt" && <PreBuiltPCs />}
        {currentPage === "builder" && <CustomBuilder />}
        {currentPage === "catalog" && <ProductCatalog />}
        {currentPage === "cart" && <Cart />}
        {currentPage === "about" && <AboutPage />}
        {currentPage === "contact" && <ContactPage />}
      </Authenticated>
    </>
  );
}

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">About PRE</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-6">
              PRE stands for empowerment through technology. We believe in democratizing electronics — 
              giving people the tools to create, build, and innovate. Our mission is to make 
              high-performance computing accessible to everyone, from enthusiasts to professionals.
            </p>
            
            <h2 className="text-2xl font-bold text-red-400 mb-4">Why Choose PRE?</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✓</span>
                Revolutionary designs with cutting-edge performance
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✓</span>
                Transparent pricing with no hidden costs
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✓</span>
                Expert assembly and rigorous testing
              </li>
              <li className="flex items-center">
                <span className="text-red-500 mr-3">✓</span>
                Comprehensive warranty and support
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-red-900/20 to-black/40 p-8 rounded-lg border border-red-500/30">
            <h3 className="text-xl font-bold text-white mb-4">Our Values</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-red-400">Innovation</h4>
                <p className="text-gray-300 text-sm">Pushing the boundaries of what's possible in PC building</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400">Quality</h4>
                <p className="text-gray-300 text-sm">Using only the finest components and materials</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400">Community</h4>
                <p className="text-gray-300 text-sm">Building a community of passionate creators and builders</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-400">Sustainability</h4>
                <p className="text-gray-300 text-sm">Committed to environmental responsibility in all we do</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Contact PRE</h1>
        
        <div className="bg-gradient-to-br from-red-900/20 to-black/40 p-8 rounded-lg border border-red-500/30">
          <form className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Subject</label>
              <select className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded text-white focus:border-red-500 focus:outline-none">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Custom Build Request</option>
                <option>Warranty Claim</option>
                <option>Partnership</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Message</label>
              <textarea
                rows={6}
                className="w-full px-4 py-3 bg-black/50 border border-red-500/30 rounded text-white placeholder-gray-400 focus:border-red-500 focus:outline-none resize-none"
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors"
            >
              Send Message
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-red-500/30">
            <h3 className="text-white font-semibold mb-4">Other Ways to Reach Us</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <span className="text-red-500 mr-3">📧</span>
                support@pre-electronics.com
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3">📱</span>
                WhatsApp: +1 (555) PRE-TECH
              </div>
              <div className="flex items-center">
                <span className="text-red-500 mr-3">🕒</span>
                Mon-Fri: 9AM-6PM EST
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
