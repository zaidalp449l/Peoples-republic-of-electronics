import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface BuildComponent {
  category: string;
  product: any | null;
}

export function CustomBuilder() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, any>>({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    psu: null,
    case: null,
    cooling: null,
  });

  const [activeCategory, setActiveCategory] = useState<string>("cpu");
  
  const categories = useQuery(api.products.getCategories);
  const products = useQuery(api.products.getProductsByCategory, {
    type: "component",
  });
  
  const addToCart = useMutation(api.cart.addToCart);

  const componentCategories = [
    { id: "cpu", name: "CPU", icon: "🔥", required: true },
    { id: "gpu", name: "Graphics Card", icon: "🎮", required: true },
    { id: "motherboard", name: "Motherboard", icon: "🔌", required: true },
    { id: "ram", name: "Memory (RAM)", icon: "💾", required: true },
    { id: "storage", name: "Storage", icon: "💿", required: true },
    { id: "psu", name: "Power Supply", icon: "⚡", required: true },
    { id: "case", name: "PC Case", icon: "📦", required: true },
    { id: "cooling", name: "CPU Cooler", icon: "❄️", required: false },
  ];

  const getTotalPrice = () => {
    return Object.values(selectedComponents).reduce((total, component) => {
      return total + (component?.price || 0);
    }, 0);
  };

  const getCompatibilityIssues = () => {
    const issues: string[] = [];
    
    // Example compatibility checks
    if (selectedComponents.cpu && selectedComponents.motherboard) {
      // Check socket compatibility (simplified)
      if (selectedComponents.cpu.specifications?.socket !== selectedComponents.motherboard.specifications?.socket) {
        issues.push("CPU and Motherboard socket mismatch");
      }
    }
    
    if (selectedComponents.psu && selectedComponents.gpu) {
      // Check power requirements (simplified)
      const gpuPower = selectedComponents.gpu.specifications?.power || 0;
      const psuPower = selectedComponents.psu.specifications?.power || 0;
      if (psuPower < gpuPower + 200) { // 200W buffer for other components
        issues.push("Power supply may be insufficient for selected GPU");
      }
    }
    
    return issues;
  };

  const isConfigurationComplete = () => {
    const requiredCategories = componentCategories.filter(cat => cat.required);
    return requiredCategories.every(cat => selectedComponents[cat.id]);
  };

  const handleComponentSelect = (component: any) => {
    setSelectedComponents(prev => ({
      ...prev,
      [activeCategory]: component,
    }));
    
    // Auto-advance to next category
    const currentIndex = componentCategories.findIndex(cat => cat.id === activeCategory);
    if (currentIndex < componentCategories.length - 1) {
      setActiveCategory(componentCategories[currentIndex + 1].id);
    }
  };

  const handleAddToCart = async () => {
    if (!isConfigurationComplete()) {
      toast.error("Please select all required components");
      return;
    }

    try {
      // For now, add each component individually
      // In a real app, you'd create a custom build record first
      for (const [category, component] of Object.entries(selectedComponents)) {
        if (component) {
          await addToCart({
            productId: component._id,
            quantity: 1,
            price: component.price,
          });
        }
      }
      toast.success("Custom build added to cart!");
    } catch (error) {
      toast.error("Failed to add build to cart");
    }
  };

  const filteredProducts = products?.filter(product => {
    // Filter products by category based on activeCategory
    const categoryMap: Record<string, string> = {
      cpu: "cpu",
      gpu: "gpu",
      motherboard: "motherboard", 
      ram: "memory",
      storage: "storage",
      psu: "power-supply",
      case: "case",
      cooling: "cooling",
    };
    
    const targetCategory = categories?.find(cat => cat.slug === categoryMap[activeCategory]);
    return targetCategory && product.categoryId === targetCategory._id;
  }) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Custom PC Builder</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Build your dream PC with our interactive configurator. 
          Get real-time compatibility checks and performance estimates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Component Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 p-4 sticky top-4">
            <h3 className="text-lg font-bold text-white mb-4">Build Components</h3>
            
            <div className="space-y-2">
              {componentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center justify-between p-3 rounded transition-colors ${
                    activeCategory === category.id
                      ? "bg-red-600 text-white"
                      : "bg-black/40 text-gray-300 hover:bg-red-600/20"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {category.required && (
                      <span className="text-xs bg-red-600 text-white px-1 rounded">REQ</span>
                    )}
                    {selectedComponents[category.id] && (
                      <span className="text-green-400">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Build Summary */}
            <div className="mt-6 pt-4 border-t border-red-500/30">
              <h4 className="font-semibold text-white mb-3">Build Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Price:</span>
                  <span className="text-red-400 font-bold">${getTotalPrice().toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Components:</span>
                  <span className="text-white">
                    {Object.values(selectedComponents).filter(Boolean).length}/{componentCategories.length}
                  </span>
                </div>
              </div>

              {/* Compatibility Issues */}
              {getCompatibilityIssues().length > 0 && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded">
                  <h5 className="text-red-400 font-semibold text-sm mb-2">⚠️ Compatibility Issues</h5>
                  <ul className="text-xs text-red-300 space-y-1">
                    {getCompatibilityIssues().map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isConfigurationComplete() || getCompatibilityIssues().length > 0}
                className={`w-full mt-4 py-3 rounded font-semibold transition-colors ${
                  isConfigurationComplete() && getCompatibilityIssues().length === 0
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                Add Build to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Component Selection Area */}
        <div className="lg:col-span-3">
          {/* Selected Component Display */}
          {selectedComponents[activeCategory] && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-900/20 to-black/40 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-green-400 font-semibold">Selected {componentCategories.find(c => c.id === activeCategory)?.name}</h4>
                  <p className="text-white font-medium">{selectedComponents[activeCategory].name}</p>
                  <p className="text-green-400 font-bold">${selectedComponents[activeCategory].price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => setSelectedComponents(prev => ({ ...prev, [activeCategory]: null }))}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Component Selection Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Select {componentCategories.find(c => c.id === activeCategory)?.name}
            </h2>
            <p className="text-gray-300">
              Choose from our curated selection of high-quality components
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl text-gray-600 mb-4">📦</div>
              <h3 className="text-xl font-semibold text-white mb-2">No components found</h3>
              <p className="text-gray-400">
                We're working on adding more {componentCategories.find(c => c.id === activeCategory)?.name.toLowerCase()} options.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border transition-all duration-300 cursor-pointer ${
                    selectedComponents[activeCategory]?._id === product._id
                      ? "border-green-500 shadow-lg shadow-green-500/20"
                      : "border-red-500/30 hover:border-red-500/60"
                  }`}
                  onClick={() => handleComponentSelect(product)}
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-black/40 rounded-t-lg relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-red-400">
                          {componentCategories.find(c => c.id === activeCategory)?.icon}
                        </span>
                      </div>
                    )}
                    
                    {selectedComponents[activeCategory]?._id === product._id && (
                      <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        ✓
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
                    
                    {/* Specifications */}
                    {product.specifications && (
                      <div className="mb-3 text-xs text-gray-300 space-y-1">
                        {product.specifications.brand && (
                          <div>Brand: {product.specifications.brand}</div>
                        )}
                        {product.specifications.model && (
                          <div>Model: {product.specifications.model}</div>
                        )}
                        {product.specifications.performance && (
                          <div>Performance: {product.specifications.performance}</div>
                        )}
                      </div>
                    )}

                    {/* Performance Score */}
                    {product.performanceScore && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Performance</span>
                          <span className="text-red-400">{product.performanceScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${product.performanceScore}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-red-400">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through text-sm">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                      }`}>
                        {product.inStock ? `${product.stockCount} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
