import Link from 'next/link';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav className={styles.nav}>
      <Link
        href={`${baseUrl}?page=${currentPage - 1}`}
        className={hasPreviousPage ? styles.link : `${styles.link} ${styles.disabled}`}
      >
        Previous
      </Link>
      <span className={styles.text}>
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className={hasNextPage ? styles.link : `${styles.link} ${styles.disabled}`}
      >
        Next
      </Link>
    </nav>
  );
}