import styles from './Product.module.css';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  return (
    <main>
      <h1>
        Detalles del Producto
      </h1>
      <p>
        Mostrando información para el producto con ID: <strong>{id}</strong>
      </p>
    </main>
  );
}