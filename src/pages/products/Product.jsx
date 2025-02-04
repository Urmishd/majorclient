import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Container,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled } from '@mui/material/styles';
import PreviewProduct from './PreviewProduct';

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

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '16px',
});

const Product = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
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
              <StyledCard onClick={() => setSelectedProductId(product._id || product.id)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images?.[0] || 'placeholder.jpg'}
                  alt={product.name || 'Product Image'}
                  style={{ objectFit: 'cover' }}
                />

                <StyledCardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {product.description || 'No description available'}
                  </Typography>

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
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/preview/${product._id || product.id}`);
                    }}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
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
      {selectedProductId &&
        <PreviewProduct
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedProductId(null);
          }}
          productId={selectedProductId}
        />
      }
    </Container>
  );
};

export default Product;
