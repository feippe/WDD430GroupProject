import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { images: true, seller: { include: { user: true } } },
    take: 24,
  });

  return (
    <div className="container mx-auto py-8 grid gap-6 md:grid-cols-3">
      {products.map(p => (
        <article key={p.id} className="border rounded-lg p-4">
          <img
            src={p.images[0]?.url ?? "/placeholder.svg"}
            alt={p.images[0]?.alt ?? p.title}
            className="w-full aspect-video object-cover rounded-md"
          />
          <h2 className="mt-3 font-semibold">{p.title}</h2>
          <p className="text-sm text-muted-foreground">
            {Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(p.priceCents / 100)}
          </p>
        </article>
      ))}
    </div>
  );
}
