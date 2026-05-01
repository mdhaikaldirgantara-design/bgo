import React, { useEffect, useState } from 'react';
import { useMenuStore } from '../store/useMenuStore';
import { useOrderStore } from '../store/useOrderStore';

export default function POS() {
  const { categories, menuItems, fetchMenu, isLoading } = useMenuStore();
  const { cart, addToCart, updateQuantity, clearCart, submitOrder } = useOrderStore();
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const displayedItems = activeCategory 
    ? menuItems.filter(item => item.categoryId === activeCategory)
    : menuItems;

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.menuItem.price), 0);
  const tax = Math.round(subtotal * 0.10);
  const total = subtotal + tax;

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-pos-bg text-pos-text">Loading...</div>;

  return (
    <div className="flex h-full bg-pos-bg text-pos-text font-body">
      {/* Left Panel - Menu */}
      <div className="w-full md:w-3/5 lg:w-2/3 p-6 flex flex-col h-full border-r border-pos-surface">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-semibold text-pos-accent">Menu</h1>
          <div className="text-pos-text-muted bg-pos-surface px-4 py-2 rounded-full">Table 1</div>
        </header>
        
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar shrink-0">
          <button 
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${!activeCategory ? 'bg-pos-accent text-pos-bg shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'bg-pos-surface text-pos-text hover:bg-opacity-80'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all ${activeCategory === cat.id ? 'bg-pos-accent text-pos-bg shadow-[0_0_15px_rgba(245,166,35,0.4)]' : 'bg-pos-surface text-pos-text hover:bg-opacity-80'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 pr-2">
          {displayedItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => addToCart(item)}
              className="bg-pos-card rounded-card p-4 shadow-pos cursor-pointer hover:scale-[0.98] transition-transform flex flex-col h-full border border-transparent hover:border-pos-surface"
            >
              <div className="h-28 bg-pos-surface rounded-std mb-4 flex items-center justify-center text-pos-text-muted overflow-hidden">
                 <div className="w-12 h-12 rounded-full bg-pos-bg opacity-50"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg leading-tight mb-1">{item.name}</h3>
                <p className="text-xs text-pos-text-muted line-clamp-2">{item.description}</p>
              </div>
              <div className="text-pos-accent font-display font-semibold mt-3">{formatCurrency(item.price)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Cart */}
      <div className="hidden md:flex w-2/5 lg:w-1/3 bg-pos-card h-full flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.4)] z-10">
        <header className="p-6 border-b border-pos-surface flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-display font-semibold">Current Order</h2>
            <div className="text-sm text-pos-text-muted mt-1">Order #0001</div>
          </div>
          <button onClick={clearCart} className="text-pos-error text-sm font-medium hover:underline">Clear</button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-pos-text-muted opacity-50">
              <div className="w-16 h-16 rounded-full bg-pos-surface mb-4 flex items-center justify-center text-2xl">🍽️</div>
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((cartItem) => (
              <div key={cartItem.menuItem.id} className="flex justify-between items-center group">
                <div className="flex-1 pr-4">
                  <div className="font-medium text-lg leading-snug">{cartItem.menuItem.name}</div>
                  <div className="text-sm text-pos-text-muted">{formatCurrency(cartItem.menuItem.price)}</div>
                </div>
                <div className="flex items-center gap-3 bg-pos-bg rounded-full px-1 py-1 border border-pos-surface">
                  <button 
                    onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-pos-accent hover:bg-pos-surface transition-colors"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-medium">{cartItem.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-pos-accent hover:bg-pos-surface transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-pos-surface bg-pos-bg">
          <div className="flex justify-between mb-3 text-pos-text-muted">
            <span>Subtotal</span>
            <span className="font-medium text-pos-text">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-5 text-pos-text-muted">
            <span>Tax (10%)</span>
            <span className="font-medium text-pos-text">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between mb-6 font-display text-2xl font-semibold text-pos-accent">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={submitOrder}
              disabled={cart.length === 0}
              className="flex-1 bg-pos-accent text-pos-bg py-4 rounded-card font-semibold text-lg hover:bg-opacity-90 transition-all shadow-[0_4px_15px_rgba(245,166,35,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              Kitchen
            </button>
            <button 
              onClick={() => { useOrderStore.getState().chargeOrder(); alert('Order charged successfully!'); }}
              disabled={cart.length === 0}
              className="flex-1 bg-pos-success text-pos-bg py-4 rounded-card font-semibold text-lg hover:bg-opacity-90 transition-all shadow-[0_4px_15px_rgba(46,199,122,0.3)] disabled:opacity-50 disabled:shadow-none"
            >
              Charge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
