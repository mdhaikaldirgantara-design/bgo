import { db } from './db';

export async function seedDatabase() {
  // Check if already seeded
  const staffCount = await db.staff.count();
  if (staffCount > 0) return; // Already seeded

  console.log('Seeding database with demo data...');

  await db.transaction('rw', db.categories, db.menuItems, db.tables, db.staff, async () => {
    // 1. Staff
    await db.staff.bulkAdd([
      { name: 'Bima', pin: '1234', role: 'manager', isActive: true },
      { name: 'Sari', pin: '2222', role: 'cashier', isActive: true },
      { name: 'Dika', pin: '3333', role: 'bartender', isActive: true }
    ]);

    // 2. Categories
    const catIds = await db.categories.bulkAdd([
      { name: 'Cocktails', color: '#F5A623', icon: 'Martini', isActive: true, sortOrder: 1 },
      { name: 'Beer & Wine', color: '#C9943A', icon: 'Wine', isActive: true, sortOrder: 2 },
      { name: 'Mocktails', color: '#3B9EE8', icon: 'GlassWater', isActive: true, sortOrder: 3 },
      { name: 'Food', color: '#E84B6A', icon: 'Utensils', isActive: true, sortOrder: 4 },
      { name: 'Snacks', color: '#2EC77A', icon: 'Pizza', isActive: true, sortOrder: 5 },
      { name: 'Others', color: '#8A8680', icon: 'Coffee', isActive: true, sortOrder: 6 }
    ], { allKeys: true });

    // 3. Menu Items
    await db.menuItems.bulkAdd([
      { categoryId: catIds[0], name: 'Mojito', price: 65000, description: 'Classic mint & rum', isAvailable: true, imageUrl: '', preparationTime: 5 },
      { categoryId: catIds[0], name: 'Negroni', price: 75000, description: 'Gin, Campari, Vermouth', isAvailable: true, imageUrl: '', preparationTime: 5 },
      { categoryId: catIds[0], name: 'Old Fashioned', price: 85000, description: 'Bourbon & bitters', isAvailable: true, imageUrl: '', preparationTime: 5 },
      { categoryId: catIds[1], name: 'Draft Beer Pint', price: 55000, description: 'Local draft', isAvailable: true, imageUrl: '', preparationTime: 2 },
      { categoryId: catIds[1], name: 'House Red Wine', price: 90000, description: 'Glass', isAvailable: true, imageUrl: '', preparationTime: 2 },
      { categoryId: catIds[2], name: 'Virgin Mojito', price: 45000, description: 'No alcohol', isAvailable: true, imageUrl: '', preparationTime: 4 },
      { categoryId: catIds[2], name: 'Mineral Water', price: 15000, description: 'Sparkling or still', isAvailable: true, imageUrl: '', preparationTime: 1 },
      { categoryId: catIds[3], name: 'Wagyu Burger', price: 120000, description: 'With fries', isAvailable: true, imageUrl: '', preparationTime: 15 },
      { categoryId: catIds[3], name: 'Pasta Carbonara', price: 95000, description: 'Creamy parmesan', isAvailable: true, imageUrl: '', preparationTime: 12 },
      { categoryId: catIds[4], name: 'Crispy Calamari', price: 85000, description: 'With tartare sauce', isAvailable: true, imageUrl: '', preparationTime: 8 },
      { categoryId: catIds[4], name: 'Truffle Fries', price: 65000, description: 'Parmesan & truffle oil', isAvailable: true, imageUrl: '', preparationTime: 8 }
    ]);

    // 4. Tables
    const tables = [];
    // Indoor T1-T8
    for(let i=1; i<=8; i++) {
      tables.push({ name: `T${i}`, capacity: 4, zone: 'Indoor', status: 'available', currentOrderId: null });
    }
    // Bar B1-B4
    for(let i=1; i<=4; i++) {
      tables.push({ name: `B${i}`, capacity: 2, zone: 'Bar', status: 'available', currentOrderId: null });
    }
    await db.tables.bulkAdd(tables);
  });

  console.log('Database seeded successfully.');
}
