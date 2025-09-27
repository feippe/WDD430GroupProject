
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    id: 1,
    name: 'Jarrón de Cerámica Artesanal',
    price: 45.00,
    imageUrl: '/images/pottery-vase.jpg',
    description: 'Un jarrón único hecho a mano, perfecto para flores frescas o como pieza decorativa.'
  },
  {
    id: 2,
    name: 'Tabla de Cortar de Nogal',
    price: 60.00,
    imageUrl: '/images/walnut-board.jpg',
    description: 'Tabla de cortar de madera de nogal maciza, tratada con aceites minerales seguros para alimentos.'
  },
  {
    id: 3,
    name: 'Vela de Soja Aromática',
    price: 25.00,
    imageUrl: '/images/soy-candle.jpg',
    description: 'Vela de cera de soja vertida a mano con aroma a lavanda y eucalipto.'
  },
  {
    id: 4,
    name: 'Manta de Lana Tejida',
    price: 120.00,
    imageUrl: '/images/wool-blanket.jpg',
    description: 'Una manta acogedora y cálida, tejida a mano con 100% lana de merino.'
  }
];

async function main() {
  console.log(`Start seeding ...`);

  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });

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