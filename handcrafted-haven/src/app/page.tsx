'use client';
import styles from './HomePage.module.css';
import { Button, Typography, Container } from '@mui/material';


export default function HomePage() {
  return (
    <Container sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Bienvenido a Mi Tienda
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph>
        El mejor lugar para encontrar productos increíbles.
      </Typography>
      <Button variant="contained" color="primary" size="large">
        Explorar Catálogo
      </Button>
    </Container>
  );
}