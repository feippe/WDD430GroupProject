import styles from './Catalog.module.css';

export default function CatalogPage() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Nuestro Catálogo</h1>
      <div className={styles.grid}>
        <a href='/product/1' className={styles.productCard}>Producto 1</a>
        <a href='/product/2' className={styles.productCard}>Producto 2</a>
        <a href='/product/3' className={styles.productCard}>Producto 3</a>
        <a href='/product/4' className={styles.productCard}>Producto 4</a>
      </div>
    </main>
  );
}