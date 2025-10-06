type ProductPageProps = {
  params: {
    id: string;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.id;

  const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`);
  const product = await productResponse.json();

  if (productResponse.status !== 200) {
    return <div>Producto no encontrado o error.</div>;
  }

  return (
    <main>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Precio: ${product.price}</p>
      {/* TODO */}
    </main>
  );
}