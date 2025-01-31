import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
  position: 'relative',
  objectFit: 'cover',
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      console.log('Fetched products:', data);
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImagePath = (image) => {
    if (!image || image === 'undefined' || image.trim() === '') {
      console.warn('Invalid image:', image);
      // return '/api/placeholder/400/300'; 
    }
    const imagePath = `http://localhost:3000/api/products${image}`;
    console.log('Final image path:', imagePath);
    return imagePath;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box p={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Our Products
        </Typography>

        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} lg={4} key={product._id || product.id}>
              <StyledCard>
                <Box>
                  <img
                    src={product.images[0]}
                    alt={product.name || 'Product Image'}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
               
                </Box>
                <StyledCardContent>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description || 'No description available'}
                    </Typography>
                  </Box>

                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" color="primary">
                        ${product.price?.toFixed(2) || '0.00'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          product.stock > 10
                            ? 'success.main'
                            : product.stock > 0
                              ? 'warning.main'
                              : 'error.main'
                        }
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      disabled={!product.stock || product.stock <= 0}
                    >
                      {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </Box>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {products.length === 0 && !error && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No products available at the moment.</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Product;



