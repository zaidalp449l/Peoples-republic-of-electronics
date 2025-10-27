import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

// Get products by category
export const getProductsByCategory = query({
  args: { 
    categorySlug: v.optional(v.string()),
    type: v.optional(v.union(v.literal("component"), v.literal("prebuilt"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products: Doc<"products">[] = [];
    
    if (args.categorySlug) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
        .unique();
      
      if (category) {
        products = await ctx.db
          .query("products")
          .withIndex("by_category", (q) => q.eq("categoryId", category._id))
          .collect();
      }
    } else {
      products = await ctx.db.query("products").collect();
    }
    
    let filtered = products;
    if (args.type) {
      filtered = products.filter(p => p.type === args.type);
    }
    
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }
    
    return filtered;
  },
});

// Get featured products
export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(8);
  },
});

// Search products
export const searchProducts = query({
  args: { 
    searchTerm: v.string(),
    categoryId: v.optional(v.id("categories")),
    type: v.optional(v.union(v.literal("component"), v.literal("prebuilt"))),
  },
  handler: async (ctx, args) => {
    let searchQuery = ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => {
        let query = q.search("name", args.searchTerm);
        if (args.categoryId) {
          query = query.eq("categoryId", args.categoryId);
        }
        return query;
      });
    
    const results = await searchQuery.take(20);
    
    if (args.type) {
      return results.filter(p => p.type === args.type);
    }
    
    return results;
  },
});

// Get single product
export const getProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

// Get pre-built configurations
export const getPrebuiltConfigs = query({
  args: { 
    category: v.optional(v.union(v.literal("entry"), v.literal("mid"), v.literal("pro"), v.literal("ultra"))),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let configs: Doc<"prebuiltConfigs">[] = [];
    
    if (args.category) {
      configs = await ctx.db
        .query("prebuiltConfigs")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else if (args.featured !== undefined) {
      configs = await ctx.db
        .query("prebuiltConfigs")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .collect();
    } else {
      configs = await ctx.db.query("prebuiltConfigs").collect();
    }
    
    // Populate component details
    const populatedConfigs = await Promise.all(
      configs.map(async (config) => {
        const components = await Promise.all([
          ctx.db.get(config.components.cpu),
          ctx.db.get(config.components.gpu),
          ctx.db.get(config.components.motherboard),
          ctx.db.get(config.components.ram),
          ctx.db.get(config.components.storage),
          ctx.db.get(config.components.psu),
          ctx.db.get(config.components.case),
          config.components.cooling ? ctx.db.get(config.components.cooling) : null,
        ]);
        
        return {
          ...config,
          populatedComponents: {
            cpu: components[0],
            gpu: components[1],
            motherboard: components[2],
            ram: components[3],
            storage: components[4],
            psu: components[5],
            case: components[6],
            cooling: components[7],
          },
        };
      })
    );
    
    return populatedConfigs;
  },
});

// Get single prebuilt config
export const getPrebuiltConfig = query({
  args: { configId: v.id("prebuiltConfigs") },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) return null;
    
    // Populate component details
    const components = await Promise.all([
      ctx.db.get(config.components.cpu),
      ctx.db.get(config.components.gpu),
      ctx.db.get(config.components.motherboard),
      ctx.db.get(config.components.ram),
      ctx.db.get(config.components.storage),
      ctx.db.get(config.components.psu),
      ctx.db.get(config.components.case),
      config.components.cooling ? ctx.db.get(config.components.cooling) : null,
    ]);
    
    return {
      ...config,
      populatedComponents: {
        cpu: components[0],
        gpu: components[1],
        motherboard: components[2],
        ram: components[3],
        storage: components[4],
        psu: components[5],
        case: components[6],
        cooling: components[7],
      },
    };
  },
});
