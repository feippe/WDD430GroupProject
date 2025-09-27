// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Create an array of 20 new product data objects in English
const newProducts = [
  { name: 'Artisanal Ceramic Mug', price: 28.00, imageUrl: 'https://picsum.photos/seed/product1/600/600', description: 'A unique, handcrafted ceramic mug, perfect for your morning coffee or tea. Dishwasher and microwave safe.' },
  { name: 'Walnut Wood Serving Tray', price: 75.00, imageUrl: 'https://picsum.photos/seed/product2/600/600', description: 'A beautiful and durable serving tray made from solid walnut wood, finished with food-safe oil.' },
  { name: 'Linen Throw Pillow', price: 55.00, imageUrl: 'https://picsum.photos/seed/product3/600/600', description: 'A soft and comfortable throw pillow made from 100% natural linen. Includes a plush feather insert.' },
  { name: 'Scented Soy Wax Candle', price: 32.00, imageUrl: 'https://picsum.photos/seed/product4/600/600', description: 'Hand-poured soy wax candle with a relaxing lavender and chamomile scent. 40+ hour burn time.' },
  { name: 'Handwoven Wool Blanket', price: 150.00, imageUrl: 'https://picsum.photos/seed/product5/600/600', description: 'A cozy and warm blanket, handwoven with 100% merino wool. Perfect for chilly evenings.' },
  { name: 'Leather Journal Cover', price: 65.00, imageUrl: 'https://picsum.photos/seed/product6/600/600', description: 'A rustic, full-grain leather cover for A5 notebooks. Develops a beautiful patina over time.' },
  { name: 'Minimalist Concrete Planter', price: 40.00, imageUrl: 'https://picsum.photos/seed/product7/600/600', description: 'A modern, minimalist planter made from hand-cast concrete. Ideal for succulents and small plants.' },
  { name: 'Oak Wood Coaster Set', price: 35.00, imageUrl: 'https://picsum.photos/seed/product8/600/600', description: 'A set of four solid oak wood coasters, sanded smooth and finished with a water-resistant coating.' },
  { name: 'Brass Mechanical Pencil', price: 85.00, imageUrl: 'https://picsum.photos/seed/product9/600/600', description: 'A precision-engineered mechanical pencil with a solid brass body that feels great in your hand.' },
  { name: 'Canvas Tote Bag with Leather Straps', price: 90.00, imageUrl: 'https://picsum.photos/seed/product10/600/600', description: 'A durable and stylish tote bag made from heavy-duty canvas with genuine leather straps.' },
  { name: 'Porcelain Dinner Plate Set', price: 120.00, imageUrl: 'https://picsum.photos/seed/product11/600/600', description: 'Set of four minimalist porcelain dinner plates with a subtle matte glaze finish.' },
  { name: 'Glass and Cork Coffee Canister', price: 48.00, imageUrl: 'https://picsum.photos/seed/product12/600/600', description: 'An airtight glass canister with a natural cork lid to keep your coffee beans fresh.' },
  { name: 'Hand-forged Iron Bottle Opener', price: 50.00, imageUrl: 'https://picsum.photos/seed/product13/600/600', description: 'A rugged bottle opener, hand-forged from a single piece of iron by a master blacksmith.' },
  { name: 'Bamboo Bath Tray', price: 70.00, imageUrl: 'https://picsum.photos/seed/product14/600/600', description: 'An expandable bamboo tray for your bathtub, with space for a book, a glass, and a candle.' },
  { name: 'Set of 3 Botanical Prints', price: 95.00, imageUrl: 'https://picsum.photos/seed/product15/600/600', description: 'A beautiful set of three art prints featuring vintage botanical illustrations. Frames not included.' },
  { name: 'Stoneware Pour-Over Coffee Dripper', price: 58.00, imageUrl: 'https://picsum.photos/seed/product16/600/600', description: 'A stylish and functional pour-over coffee dripper made from high-quality stoneware.' },
  { name: 'Felt Desk Mat', price: 45.00, imageUrl: 'https://picsum.photos/seed/product17/600/600', description: 'A soft and minimalist desk mat made from premium merino wool felt. Protects your desk in style.' },
  { name: 'Stainless Steel Water Bottle', price: 42.00, imageUrl: 'https://picsum.photos/seed/product18/600/600', description: 'A double-walled insulated water bottle that keeps drinks cold for 24 hours or hot for 12.' },
  { name: 'Ash Wood Phone Stand', price: 38.00, imageUrl: 'https://picsum.photos/seed/product19/600/600', description: 'A simple and elegant phone stand crafted from a single piece of solid ash wood.' },
  { name: 'Beeswax Food Wraps (Set of 3)', price: 30.00, imageUrl: 'https://picsum.photos/seed/product20/600/600', description: 'A sustainable alternative to plastic wrap. Set of three assorted sizes. Reusable and eco-friendly.' },
];

async function main() {
  console.log(`Start seeding ...`);

  // Step 1: Delete all existing products to start from a clean state
  await prisma.product.deleteMany({});
  console.log('Deleted all existing products.');

  // Step 2: Create the 20 new products
  await prisma.product.createMany({
    data: newProducts,
  });
  console.log(`Created 20 new products.`);

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });