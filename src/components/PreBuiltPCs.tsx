import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function PreBuiltPCs() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const prebuiltConfigs = useQuery(api.products.getPrebuiltConfigs, 
    selectedCategory !== "all" ? { category: selectedCategory as any } : {}
  );
  const addToCart = useMutation(api.cart.addToCart);

  const categories = [
    { id: "all", name: "All Builds", description: "View all configurations" },
    { id: "entry", name: "Entry Level", description: "Perfect for everyday computing and light gaming" },
    { id: "mid", name: "Mid Range", description: "Great performance for gaming and productivity" },
    { id: "pro", name: "Pro Level", description: "High-end performance for demanding tasks" },
    { id: "ultra", name: "Ultra Performance", description: "Extreme performance for professionals" },
  ];

  const handleAddToCart = async (config: any) => {
    try {
      await addToCart({
        prebuiltId: config._id,
        quantity: 1,
        price: config.price,
      });
      toast.success(`${config.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Pre-Built PCs</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Hand-crafted systems optimized for performance, reliability, and value. 
          Each build is thoroughly tested and comes with our comprehensive warranty.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-red-600 text-white"
                  : "bg-black/40 text-gray-300 border border-red-500/30 hover:border-red-500/60"
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{category.name}</div>
                <div className="text-xs opacity-80">{category.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {prebuiltConfigs === undefined && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Products Grid */}
      {prebuiltConfigs && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prebuiltConfigs.map((config) => (
            <div
              key={config._id}
              className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 overflow-hidden hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
            >
              {/* Product Image */}
              <div className="aspect-video bg-black/40 relative overflow-hidden">
                {config.images && config.images.length > 0 ? (
                  <img
                    src={config.images[0]}
                    alt={config.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl text-red-400">🖥️</div>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    config.category === "entry" ? "bg-green-600 text-white" :
                    config.category === "mid" ? "bg-blue-600 text-white" :
                    config.category === "pro" ? "bg-purple-600 text-white" :
                    "bg-red-600 text-white"
                  }`}>
                    {config.category.toUpperCase()}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    config.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}>
                    {config.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{config.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{config.description}</p>

                {/* Performance Scores */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Gaming</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(config.performanceScores.gaming / 20)
                              ? "text-red-400"
                              : "text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        {config.performanceScores.gaming}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Productivity</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(config.performanceScores.productivity / 20)
                              ? "text-red-400"
                              : "text-gray-600"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        {config.performanceScores.productivity}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Components */}
                {config.populatedComponents && (
                  <div className="mb-4 p-3 bg-black/30 rounded border border-red-500/20">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Key Components</h4>
                    <div className="space-y-1 text-xs text-gray-300">
                      <div>CPU: {config.populatedComponents.cpu?.name}</div>
                      <div>GPU: {config.populatedComponents.gpu?.name}</div>
                      <div>RAM: {config.populatedComponents.ram?.name}</div>
                      <div>Storage: {config.populatedComponents.storage?.name}</div>
                    </div>
                  </div>
                )}

                {/* Target Use Cases */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {config.targetUse.map((use) => (
                      <span
                        key={use}
                        className="px-2 py-1 bg-red-600/20 text-red-300 text-xs rounded border border-red-500/30"
                      >
                        {use}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-red-400">
                      ${config.price.toLocaleString()}
                    </span>
                    {config.originalPrice && config.originalPrice > config.price && (
                      <span className="text-gray-500 line-through ml-2">
                        ${config.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {config.originalPrice && config.originalPrice > config.price && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Save ${(config.originalPrice - config.price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(config)}
                    disabled={!config.inStock}
                    className={`w-full py-3 rounded font-semibold transition-colors ${
                      config.inStock
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-600 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {config.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                  
                  <button className="w-full py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors">
                    View Full Specs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {prebuiltConfigs && prebuiltConfigs.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-600 mb-4">🔧</div>
          <h3 className="text-xl font-semibold text-white mb-2">No builds found</h3>
          <p className="text-gray-400">
            {selectedCategory === "all" 
              ? "We're working on adding more pre-built configurations."
              : `No ${selectedCategory} builds available at the moment.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
