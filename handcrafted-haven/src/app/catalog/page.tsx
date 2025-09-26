import styles from './Catalog.module.css';

export default function CatalogPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Nuestro Catálogo</h1>
      <div className={styles.grid}>
        <div className={styles.productCard}>Producto 1</div>
        <div className={styles.productCard}>Producto 2</div>
        <div className={styles.productCard}>Producto 3</div>
        <div className={styles.productCard}>Producto 4</div>
      </div>
    </main>
  );
}