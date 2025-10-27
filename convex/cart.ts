import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's cart items
export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    // Populate item details
    const populatedItems = await Promise.all(
      cartItems.map(async (item) => {
        let itemDetails = null;
        
        if (item.productId) {
          itemDetails = await ctx.db.get(item.productId);
        } else if (item.prebuiltId) {
          itemDetails = await ctx.db.get(item.prebuiltId);
        } else if (item.customBuildId) {
          itemDetails = await ctx.db.get(item.customBuildId);
        }
        
        return {
          ...item,
          itemDetails,
        };
      })
    );
    
    return populatedItems;
  },
});

// Add item to cart
export const addToCart = mutation({
  args: {
    productId: v.optional(v.id("products")),
    prebuiltId: v.optional(v.id("prebuiltConfigs")),
    customBuildId: v.optional(v.id("customBuilds")),
    quantity: v.number(),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in to add to cart");
    
    // Check if item already exists in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => {
        if (args.productId) {
          return q.eq(q.field("productId"), args.productId);
        } else if (args.prebuiltId) {
          return q.eq(q.field("prebuiltId"), args.prebuiltId);
        } else if (args.customBuildId) {
          return q.eq(q.field("customBuildId"), args.customBuildId);
        }
        return false;
      })
      .first();
    
    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    } else {
      // Add new item
      return await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        prebuiltId: args.prebuiltId,
        customBuildId: args.customBuildId,
        quantity: args.quantity,
        priceAtTime: args.price,
      });
    }
  },
});

// Update cart item quantity
export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }
    
    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: { cartItemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }
    
    await ctx.db.delete(args.cartItemId);
  },
});

// Clear cart
export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    await Promise.all(cartItems.map(item => ctx.db.delete(item._id)));
  },
});

// Get cart total
export const getCartTotal = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { subtotal: 0, itemCount: 0 };
    
    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.priceAtTime * item.quantity);
    }, 0);
    
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    return { subtotal, itemCount };
  },
});
