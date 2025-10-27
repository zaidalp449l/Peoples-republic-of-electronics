import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

export function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const categories = useQuery(api.products.getCategories);
  const products = useQuery(api.products.getProductsByCategory, {
    categorySlug: selectedCategory !== "all" ? selectedCategory : undefined,
    type: "component",
  });
  
  const searchResults = useQuery(
    api.products.searchProducts,
    searchTerm.length > 2 ? { searchTerm, type: "component" } : "skip"
  );
  
  const addToCart = useMutation(api.cart.addToCart);

  const displayProducts = searchTerm.length > 2 ? searchResults : products;

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        price: product.price,
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Component Catalog</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Browse our extensive collection of premium PC components. 
          From cutting-edge processors to high-performance graphics cards.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-black/40 border border-red-500/30 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-red-600 text-white"
                : "bg-black/40 text-gray-300 border border-red-500/30 hover:border-red-500/60"
            }`}
          >
            All Components
          </button>
          
          {categories?.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.slug
                  ? "bg-red-600 text-white"
                  : "bg-black/40 text-gray-300 border border-red-500/30 hover:border-red-500/60"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {displayProducts === undefined && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      {/* Products Grid */}
      {displayProducts && (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-300">
              {searchTerm.length > 2 ? (
                <>Showing {displayProducts.length} results for "{searchTerm}"</>
              ) : (
                <>Showing {displayProducts.length} components{selectedCategory !== "all" && ` in ${categories?.find(c => c.slug === selectedCategory)?.name}`}</>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product._id}
                className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 overflow-hidden hover:border-red-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
              >
                {/* Product Image */}
                <div className="aspect-square bg-black/40 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-4xl text-red-400">🔧</div>
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.inStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Sale Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        SALE
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  {product.specifications && (
                    <div className="mb-3 p-2 bg-black/30 rounded border border-red-500/20">
                      <div className="text-xs text-gray-300 space-y-1">
                        {product.specifications.brand && (
                          <div><span className="text-red-400">Brand:</span> {product.specifications.brand}</div>
                        )}
                        {product.specifications.model && (
                          <div><span className="text-red-400">Model:</span> {product.specifications.model}</div>
                        )}
                        {product.specifications.performance && (
                          <div><span className="text-red-400">Performance:</span> {product.specifications.performance}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Performance Score */}
                  {product.performanceScore && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
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

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-red-400">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through ml-2 text-sm">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Stock Count */}
                  {product.inStock && (
                    <div className="mb-3 text-xs text-gray-400">
                      {product.stockCount} units available
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-2 rounded font-semibold transition-colors ${
                        product.inStock
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-600 text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                    
                    <button className="w-full py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {displayProducts && displayProducts.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl text-gray-600 mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No components found</h3>
          <p className="text-gray-400">
            {searchTerm.length > 2 
              ? `No results found for "${searchTerm}". Try a different search term.`
              : "We're working on adding more components to this category."
            }
          </p>
          {searchTerm.length > 2 && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
