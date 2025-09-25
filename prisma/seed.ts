import { PrismaClient, Role, ProductStatus } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Admin
  const adminEmail = "admin@example.com";
  const adminPass = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminPass, role: Role.ADMIN, name: "Admin" },
  });

  // Sellers + products
  for (let s = 0; s < 6; s++) {
    const email = `seller${s + 1}@example.com`;
    const pass = await bcrypt.hash("seller123", 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: pass,
        role: Role.SELLER,
        name: faker.person.fullName(),
      },
    });

    const profile = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName: faker.company.name(),
        bio: faker.lorem.sentence(),
        website: faker.internet.url(),
      },
    });

    for (let p = 0; p < 8; p++) {
      const title = faker.commerce.productName();
      const slug = faker.helpers.slugify(`${title}-${faker.string.nanoid(6)}`).toLowerCase();
      const product = await prisma.product.create({
        data: {
          sellerId: profile.id,
          title,
          slug,
          description: faker.commerce.productDescription(),
          priceCents: faker.number.int({ min: 500, max: 15000 }),
          stock: faker.number.int({ min: 0, max: 25 }),
          status: faker.helpers.arrayElement([ProductStatus.DRAFT, ProductStatus.PUBLISHED]),
        },
      });

      const imgCount = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < imgCount; i++) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: `https://picsum.photos/seed/${product.slug}-${i}/800/600`,
            alt: title,
          },
        });
      }
    }
  }

  // Customers + reviews
  for (let c = 0; c < 10; c++) {
    const email = `customer${c + 1}@example.com`;
    const pass = await bcrypt.hash("customer123", 10);
    await prisma.user.create({
      data: {
        email,
        password: pass,
        role: Role.CUSTOMER,
        name: faker.person.fullName(),
      },
    });
  }

  console.log({ admin });
}

main().finally(async () => {
  await prisma.$disconnect();
});
