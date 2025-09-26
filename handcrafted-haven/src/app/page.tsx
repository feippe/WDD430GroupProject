import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.container}>
      <div>
        <h1 className={styles.title}>Bienvenido a Mi Tienda</h1>
        <p className={styles.subtitle}>
          El mejor lugar para encontrar productos increíbles.
        </p>
      </div>
    </main>
  );
}