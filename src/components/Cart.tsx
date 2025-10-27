import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function Cart() {
  const cartItems = useQuery(api.cart.getCartItems);
  const cartTotal = useQuery(api.cart.getCartTotal);
  const updateQuantity = useMutation(api.cart.updateCartItemQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const handleQuantityChange = async (cartItemId: Id<"cartItems">, newQuantity: number) => {
    try {
      await updateQuantity({ cartItemId, quantity: newQuantity });
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId: Id<"cartItems">) => {
    try {
      await removeFromCart({ cartItemId });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  const calculateTax = (subtotal: number) => subtotal * 0.08; // 8% tax
  const calculateShipping = (subtotal: number) => subtotal > 1000 ? 0 : 50; // Free shipping over $1000

  if (cartItems === undefined || cartTotal === undefined) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  const subtotal = cartTotal.subtotal;
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
        <p className="text-gray-300">
          {cartItems.length === 0 ? "Your cart is empty" : `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-16">
          <div className="text-6xl text-gray-600 mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-white mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-6">
            Start building your dream PC or browse our pre-built systems
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
              Browse Pre-Built PCs
            </button>
            <button className="px-6 py-3 bg-transparent border border-red-500 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors">
              Start Custom Build
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 p-6"
              >
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-black/40 rounded flex items-center justify-center flex-shrink-0">
                    {(item.itemDetails as any)?.images?.[0] ? (
                      <img
                        src={(item.itemDetails as any).images[0]}
                        alt={item.itemDetails?.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-2xl text-red-400">📦</span>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.itemDetails?.name || "Unknown Item"}
                    </h3>
                    
                    {(item.itemDetails as any)?.description && (
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                        {(item.itemDetails as any).description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center hover:bg-red-700 transition-colors"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-400">
                          ${(item.priceAtTime * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">
                          ${item.priceAtTime.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <button
                onClick={handleClearCart}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-red-900/20 to-black/60 rounded-lg border border-red-500/30 p-6 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping === 0 && (
                  <div className="text-green-400 text-sm">
                    🎉 Free shipping on orders over $1,000!
                  </div>
                )}

                <div className="border-t border-red-500/30 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-red-400">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition-colors">
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <div className="text-sm text-gray-400 mb-2">Secure checkout with</div>
                <div className="flex justify-center space-x-2 text-xs text-gray-500">
                  <span>💳 Credit Card</span>
                  <span>•</span>
                  <span>🏦 Bank Transfer</span>
                  <span>•</span>
                  <span>📱 Digital Wallet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
