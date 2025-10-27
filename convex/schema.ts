import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Product categories (CPU, GPU, RAM, etc.)
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  }).index("by_slug", ["slug"]),

  // Individual components and pre-built PCs
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    type: v.union(v.literal("component"), v.literal("prebuilt")),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    description: v.string(),
    specifications: v.object({
      brand: v.optional(v.string()),
      model: v.optional(v.string()),
      performance: v.optional(v.string()),
      power: v.optional(v.number()),
      compatibility: v.optional(v.array(v.string())),
    }),
    images: v.array(v.string()),
    inStock: v.boolean(),
    stockCount: v.number(),
    featured: v.boolean(),
    performanceScore: v.optional(v.number()),
  })
    .index("by_category", ["categoryId"])
    .index("by_type", ["type"])
    .index("by_featured", ["featured"])
    .searchIndex("search_products", {
      searchField: "name",
      filterFields: ["categoryId", "type", "inStock"],
    }),

  // Pre-built PC configurations
  prebuiltConfigs: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.union(v.literal("entry"), v.literal("mid"), v.literal("pro"), v.literal("ultra")),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    description: v.string(),
    targetUse: v.array(v.string()), // ["gaming", "workstation", "streaming"]
    components: v.object({
      cpu: v.id("products"),
      gpu: v.id("products"),
      motherboard: v.id("products"),
      ram: v.id("products"),
      storage: v.id("products"),
      psu: v.id("products"),
      case: v.id("products"),
      cooling: v.optional(v.id("products")),
    }),
    performanceScores: v.object({
      gaming: v.number(),
      productivity: v.number(),
      streaming: v.number(),
    }),
    images: v.array(v.string()),
    featured: v.boolean(),
    inStock: v.boolean(),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  // Custom builds saved by users
  customBuilds: defineTable({
    userId: v.id("users"),
    name: v.string(),
    components: v.object({
      cpu: v.optional(v.id("products")),
      gpu: v.optional(v.id("products")),
      motherboard: v.optional(v.id("products")),
      ram: v.optional(v.id("products")),
      storage: v.optional(v.id("products")),
      psu: v.optional(v.id("products")),
      case: v.optional(v.id("products")),
      cooling: v.optional(v.id("products")),
    }),
    totalPrice: v.number(),
    isPublic: v.boolean(),
    compatibilityIssues: v.array(v.string()),
  }).index("by_user", ["userId"]),

  // Shopping cart items
  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.optional(v.id("products")),
    prebuiltId: v.optional(v.id("prebuiltConfigs")),
    customBuildId: v.optional(v.id("customBuilds")),
    quantity: v.number(),
    priceAtTime: v.number(),
  }).index("by_user", ["userId"]),

  // Orders
  orders: defineTable({
    userId: v.id("users"),
    orderNumber: v.string(),
    items: v.array(v.object({
      type: v.union(v.literal("product"), v.literal("prebuilt"), v.literal("custom")),
      itemId: v.string(),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("building"),
      v.literal("testing"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    paymentMethod: v.string(),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed")),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
