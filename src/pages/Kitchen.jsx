import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Clock } from 'lucide-react';

export default function Kitchen() {
  const [now, setNow] = useState(new Date());

  // Force re-render every minute to update elapsed time
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Watch orders and orderItems that are in kitchen
  const orders = useLiveQuery(
    async () => {
      // Get all items in kitchen
      const items = await db.orderItems.where('status').equals('in_kitchen').toArray();
      if (items.length === 0) return [];

      // Group items by orderId
      const orderIds = [...new Set(items.map(i => i.orderId))];
      const activeOrders = await db.orders.where('id').anyOf(orderIds).toArray();
      
      // Combine
      return activeOrders.map(order => {
        return {
          ...order,
          items: items.filter(i => i.orderId === order.id)
        };
      }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); // oldest first
    },
    []
  );

  const markItemReady = async (itemId) => {
    await db.orderItems.update(itemId, { status: 'ready' });
    
    // Check if all items in this order are ready
    const item = await db.orderItems.get(itemId);
    const orderItems = await db.orderItems.where('orderId').equals(item.orderId).toArray();
    const allReady = orderItems.every(i => i.status !== 'in_kitchen' && i.status !== 'pending');
    
    if (allReady) {
      await db.orders.update(item.orderId, { status: 'ready' });
    }
  };

  const markOrderReady = async (orderId) => {
    const items = await db.orderItems.where('orderId').equals(orderId).toArray();
    const itemsToUpdate = items.filter(i => i.status === 'in_kitchen').map(i => i.id);
    
    await db.transaction('rw', db.orderItems, db.orders, async () => {
      for (const id of itemsToUpdate) {
        await db.orderItems.update(id, { status: 'ready' });
      }
      await db.orders.update(orderId, { status: 'ready' });
    });
  };

  if (!orders) return <div className="flex h-full items-center justify-center">Loading Kitchen Display...</div>;

  const getTimeElapsed = (dateStr) => {
    const diff = now.getTime() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    return minutes;
  };

  const getTimeColor = (minutes) => {
    if (minutes < 5) return 'text-pos-success';
    if (minutes < 10) return 'text-pos-accent';
    return 'text-pos-error';
  };

  return (
    <div className="h-full flex flex-col p-6 bg-[#09090A]"> 
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-display font-semibold text-pos-accent">Kitchen Display</h1>
        <div className="flex items-center gap-2 text-pos-text-muted">
          <Clock size={20} />
          <span className="font-medium text-lg">{now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-pos-text-muted opacity-50 flex-col">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-2xl">No active orders</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start overflow-y-auto pb-10 flex-1">
          {orders.map(order => {
            const minutesElapsed = getTimeElapsed(order.createdAt);
            
            return (
              <div key={order.id} className="bg-pos-card rounded-card border border-pos-surface flex flex-col overflow-hidden shadow-pos">
                <div className={`p-4 border-b border-pos-surface flex justify-between items-center bg-pos-surface bg-opacity-30`}>
                  <div>
                    <div className="font-display font-bold text-2xl tracking-wide">
                      Table {order.tableId}
                    </div>
                    <div className="text-sm text-pos-text-muted mt-1 uppercase">{order.type.replace('_', ' ')}</div>
                  </div>
                  <div className={`font-display font-bold text-3xl ${getTimeColor(minutesElapsed)}`}>
                    {minutesElapsed}m
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => markItemReady(item.id)}
                        className="flex gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded bg-pos-surface text-pos-text flex items-center justify-center font-bold shrink-0">
                          {item.quantity}
                        </div>
                        <div>
                          <div className="font-medium text-lg group-hover:text-pos-accent transition-colors">
                            {item.itemName}
                          </div>
                          {item.notes && (
                            <div className="text-sm text-pos-accent-muted mt-0.5">
                              * {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-pos-surface bg-opacity-30 border-t border-pos-surface">
                  <button 
                    onClick={() => markOrderReady(order.id)}
                    className="w-full py-3 bg-pos-success bg-opacity-20 text-pos-success hover:bg-opacity-30 font-semibold rounded-std transition-colors"
                  >
                    Mark All Ready
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
