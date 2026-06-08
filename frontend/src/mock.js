// Mock data for JVaultX shop

export const CATEGORIES = [
  { id: 'offers', name: 'Offers', icon: 'Tag', count: 8 },
  { id: 'kits', name: 'Kits', icon: 'Package', count: 12 },
  { id: 'consumables', name: 'Consumables', icon: 'Apple', count: 14 },
  { id: 'armor', name: 'Armor', icon: 'Shield', count: 9 },
  { id: 'tools', name: 'Tools', icon: 'Pickaxe', count: 11 },
  { id: 'misc-build', name: 'Misc-Build', icon: 'Hammer', count: 18 },
  { id: 'color-blocks', name: 'Color-Blocks', icon: 'Palette', count: 24 },
  { id: 'redstone', name: 'Redstone', icon: 'Zap', count: 10 },
  { id: 'wood', name: 'Wood', icon: 'TreePine', count: 16 },
  { id: 'misc', name: 'Misc', icon: 'Box', count: 22 },
  { id: 'packs', name: 'Packs', icon: 'Layers', count: 6 },
];

const mc = (id) => `https://mc-heads.net/head/${id}.png`;
// Use textures via crafatar/mcasset cdn
const tex = (name) => `https://minecraft.wiki/images/${name}`;

// We'll use emoji-like simple block representation via colored squares + names. 
// For images we use a placeholder pixel approach with public minecraft asset CDN.
const img = (slug) => `https://mc.nerothe.com/img/1.21/minecraft_${slug}.png`;

export const PRODUCTS = [
  // OFFERS
  { id: 'p1', name: 'Starter Pack', category: 'offers', price: 4.99, oldPrice: 9.99, image: img('chest'), description: 'Perfect bundle to start your adventure. Includes basic tools, armor and food.', stock: 999, featured: true, discount: 50 },
  { id: 'p2', name: 'PVP Champion Pack', category: 'offers', price: 19.99, oldPrice: 34.99, image: img('netherite_sword'), description: 'Top tier PVP gear with enchanted netherite items.', stock: 50, featured: true, discount: 43 },
  { id: 'p3', name: 'Mega Builder Pack', category: 'offers', price: 14.99, oldPrice: 24.99, image: img('bricks'), description: '10,000 blocks of mixed materials for massive builds.', stock: 200, featured: true, discount: 40 },
  { id: 'p4', name: 'End Game Bundle', category: 'offers', price: 29.99, oldPrice: 49.99, image: img('elytra'), description: 'Elytra, totems, shulkers and full netherite kit.', stock: 30, featured: true, discount: 40 },

  // KITS
  { id: 'k1', name: 'Survival Kit', category: 'kits', price: 2.99, image: img('iron_sword'), description: 'Iron sword, iron armor, food and tools.', stock: 999 },
  { id: 'k2', name: 'PVP Kit', category: 'kits', price: 5.99, image: img('diamond_sword'), description: 'Diamond gear with sharpness and protection enchants.', stock: 500 },
  { id: 'k3', name: 'God Kit', category: 'kits', price: 9.99, image: img('netherite_sword'), description: 'Full netherite kit with max enchantments.', stock: 100 },
  { id: 'k4', name: 'Builder Kit', category: 'kits', price: 3.99, image: img('crafting_table'), description: 'Tools and stacks of building materials.', stock: 800 },
  { id: 'k5', name: 'Explorer Kit', category: 'kits', price: 4.49, image: img('compass'), description: 'Elytra, fireworks and ender pearls.', stock: 250 },
  { id: 'k6', name: 'Mining Kit', category: 'kits', price: 3.49, image: img('iron_pickaxe'), description: 'Efficiency V pickaxes and torches.', stock: 700 },

  // CONSUMABLES
  { id: 'c1', name: 'Golden Apples x16', category: 'consumables', price: 1.99, image: img('golden_apple'), description: 'Stack of 16 golden apples.', stock: 9999 },
  { id: 'c2', name: 'Enchanted Golden Apple x4', category: 'consumables', price: 4.99, image: img('enchanted_golden_apple'), description: '4 god apples.', stock: 500 },
  { id: 'c3', name: 'Totem of Undying x8', category: 'consumables', price: 5.99, image: img('totem_of_undying'), description: 'Pack of 8 totems.', stock: 300 },
  { id: 'c4', name: 'Experience Bottles x64', category: 'consumables', price: 0.99, image: img('experience_bottle'), description: 'A full stack of XP bottles.', stock: 9999 },
  { id: 'c5', name: 'Ender Pearls x16', category: 'consumables', price: 0.79, image: img('ender_pearl'), description: 'Stack of ender pearls.', stock: 5000 },
  { id: 'c6', name: 'Splash Potion Pack', category: 'consumables', price: 3.49, image: img('splash_potion'), description: 'Healing & strength potions.', stock: 1200 },

  // ARMOR
  { id: 'a1', name: 'Netherite Helmet', category: 'armor', price: 2.49, image: img('netherite_helmet'), description: 'Protection IV netherite helmet.', stock: 400 },
  { id: 'a2', name: 'Netherite Chestplate', category: 'armor', price: 3.99, image: img('netherite_chestplate'), description: 'Protection IV netherite chestplate.', stock: 350 },
  { id: 'a3', name: 'Netherite Leggings', category: 'armor', price: 3.49, image: img('netherite_leggings'), description: 'Protection IV netherite leggings.', stock: 380 },
  { id: 'a4', name: 'Netherite Boots', category: 'armor', price: 2.49, image: img('netherite_boots'), description: 'Feather Falling IV boots.', stock: 420 },
  { id: 'a5', name: 'Elytra (Mending)', category: 'armor', price: 7.99, image: img('elytra'), description: 'Mending + Unbreaking III elytra.', stock: 150 },
  { id: 'a6', name: 'Turtle Shell', category: 'armor', price: 1.49, image: img('turtle_helmet'), description: 'Water breathing turtle shell.', stock: 600 },

  // TOOLS
  { id: 't1', name: 'Netherite Pickaxe', category: 'tools', price: 2.99, image: img('netherite_pickaxe'), description: 'Efficiency V + Fortune III + Mending.', stock: 500 },
  { id: 't2', name: 'Netherite Sword', category: 'tools', price: 3.49, image: img('netherite_sword'), description: 'Sharpness V + Looting III + Mending.', stock: 480 },
  { id: 't3', name: 'Netherite Axe', category: 'tools', price: 2.79, image: img('netherite_axe'), description: 'Sharpness V + Efficiency V.', stock: 400 },
  { id: 't4', name: 'Trident', category: 'tools', price: 4.99, image: img('trident'), description: 'Riptide III + Loyalty III trident.', stock: 200 },
  { id: 't5', name: 'Bow (Infinity)', category: 'tools', price: 2.49, image: img('bow'), description: 'Power V + Infinity + Mending.', stock: 600 },
  { id: 't6', name: 'Crossbow', category: 'tools', price: 2.29, image: img('crossbow'), description: 'Quick Charge III crossbow.', stock: 550 },

  // MISC-BUILD
  { id: 'mb1', name: 'Obsidian x64', category: 'misc-build', price: 0.99, image: img('obsidian'), description: 'A stack of obsidian.', stock: 9999 },
  { id: 'mb2', name: 'Stone Bricks x256', category: 'misc-build', price: 0.79, image: img('stone_bricks'), description: 'Four stacks of stone bricks.', stock: 9999 },
  { id: 'mb3', name: 'Quartz x128', category: 'misc-build', price: 1.49, image: img('quartz_block'), description: 'Two stacks of quartz.', stock: 5000 },
  { id: 'mb4', name: 'End Stone x256', category: 'misc-build', price: 1.99, image: img('end_stone'), description: 'Four stacks of end stone.', stock: 3000 },

  // COLOR-BLOCKS
  { id: 'cb1', name: 'White Concrete x128', category: 'color-blocks', price: 0.79, image: img('white_concrete'), description: 'Two stacks of white concrete.', stock: 9999 },
  { id: 'cb2', name: 'Red Concrete x128', category: 'color-blocks', price: 0.79, image: img('red_concrete'), description: 'Two stacks of red concrete.', stock: 9999 },
  { id: 'cb3', name: 'Blue Concrete x128', category: 'color-blocks', price: 0.79, image: img('blue_concrete'), description: 'Two stacks of blue concrete.', stock: 9999 },
  { id: 'cb4', name: 'Lime Wool x128', category: 'color-blocks', price: 0.59, image: img('lime_wool'), description: 'Two stacks of lime wool.', stock: 9999 },
  { id: 'cb5', name: 'Yellow Terracotta x128', category: 'color-blocks', price: 0.69, image: img('yellow_terracotta'), description: 'Two stacks of yellow terracotta.', stock: 9999 },

  // REDSTONE
  { id: 'r1', name: 'Redstone Dust x256', category: 'redstone', price: 0.99, image: img('redstone'), description: 'Four stacks of redstone dust.', stock: 9999 },
  { id: 'r2', name: 'Pistons x32', category: 'redstone', price: 0.79, image: img('piston'), description: 'Half stack of pistons.', stock: 5000 },
  { id: 'r3', name: 'Observers x32', category: 'redstone', price: 0.99, image: img('observer'), description: 'Half stack of observers.', stock: 3000 },
  { id: 'r4', name: 'Hoppers x16', category: 'redstone', price: 1.29, image: img('hopper'), description: '16 hoppers.', stock: 2000 },

  // WOOD
  { id: 'w1', name: 'Oak Logs x256', category: 'wood', price: 0.69, image: img('oak_log'), description: 'Four stacks of oak logs.', stock: 9999 },
  { id: 'w2', name: 'Birch Logs x256', category: 'wood', price: 0.69, image: img('birch_log'), description: 'Four stacks of birch logs.', stock: 9999 },
  { id: 'w3', name: 'Dark Oak Planks x256', category: 'wood', price: 0.79, image: img('dark_oak_planks'), description: 'Four stacks of dark oak planks.', stock: 9999 },
  { id: 'w4', name: 'Spruce Logs x256', category: 'wood', price: 0.69, image: img('spruce_log'), description: 'Four stacks of spruce logs.', stock: 9999 },

  // MISC
  { id: 'm1', name: 'Shulker Box', category: 'misc', price: 1.99, image: img('shulker_box'), description: 'Empty shulker box.', stock: 800 },
  { id: 'm2', name: 'Beacon', category: 'misc', price: 4.99, image: img('beacon'), description: 'Ready to deploy beacon.', stock: 200 },
  { id: 'm3', name: 'Nether Star', category: 'misc', price: 3.49, image: img('nether_star'), description: 'A single nether star.', stock: 300 },
  { id: 'm4', name: 'Dragon Egg', category: 'misc', price: 19.99, image: img('dragon_egg'), description: 'The rare dragon egg.', stock: 10 },
  { id: 'm5', name: 'Heart of the Sea', category: 'misc', price: 2.99, image: img('heart_of_the_sea'), description: 'Craft your own conduit.', stock: 400 },

  // PACKS
  { id: 'pk1', name: 'Starter Bundle', category: 'packs', price: 9.99, image: img('chest'), description: 'Everything you need to start strong.', stock: 500 },
  { id: 'pk2', name: 'Builder Bundle', category: 'packs', price: 14.99, image: img('bricks'), description: 'Massive blocks bundle.', stock: 300 },
  { id: 'pk3', name: 'PVP Bundle', category: 'packs', price: 19.99, image: img('diamond_sword'), description: 'Full PVP loadout.', stock: 200 },
  { id: 'pk4', name: 'End Game Bundle', category: 'packs', price: 29.99, image: img('elytra'), description: 'Top tier gear and consumables.', stock: 100 },
];

export const MOCK_ORDERS = [
  { id: '1489', userId: 'demo', items: [{ name: 'PVP Kit', qty: 1 }, { name: 'Golden Apples', qty: 3 }, { name: 'Experience Bottles', qty: 5 }, { name: 'Elytra', qty: 1 }], total: 22.45, status: 'delivered', date: '2026-06-05', coords: { x: 25861, y: 33, z: -10788 } },
  { id: '1488', userId: 'demo', items: [{ name: 'Diamond Sword', qty: 1 }, { name: 'Diamond Pickaxe', qty: 1 }], total: 14.98, status: 'delivered', date: '2026-06-03', coords: { x: 12300, y: 64, z: 8200 } },
  { id: '1477', userId: 'demo', items: [{ name: 'Beacon', qty: 1 }], total: 4.99, status: 'pending', date: '2026-06-01', coords: { x: 0, y: 70, z: 0 } },
];

export const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin', mcName: 'AdminPlayer', email: 'admin@jvaultx.com' },
  { username: 'demo', password: 'demo123', role: 'user', mcName: 'DemoCrafter', email: 'demo@jvaultx.com' },
];
