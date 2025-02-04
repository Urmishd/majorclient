import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  Slide,
  DialogContent,
  DialogActions,
  Rating,
  Avatar,
  Divider,
  Card,
  CardContent,
  TextField,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useParams, useNavigate } from 'react-router-dom';
import ImageIcon from '@mui/icons-material/Image';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PreviewProduct = ({ onOpenCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyNow, setBuyNow] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [],
    imagesPreviews: []
  });

  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      try {
        const parsedReviews = JSON.parse(savedReviews);
        // Group reviews by product ID
        return parsedReviews[id] || [];
      } catch (error) {
        console.error('Error parsing saved reviews:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      const savedReviews = JSON.parse(localStorage.getItem('productReviews') || '{}');
      // Update reviews for current product while preserving others
      savedReviews[id] = reviews;
      localStorage.setItem('productReviews', JSON.stringify(savedReviews));
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  }, [reviews, id]);



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleNextImage = () => {
    if (product.images && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (product.images && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newReview.images.length > 5) {
      setSnackbarMessage('Maximum 5 images allowed');
      setSnackbarOpen(true);
      return;
    }

    const newImages = [...newReview.images];
    const newPreviews = [...newReview.imagesPreviews];

    files.forEach(file => {
      if (file.size > 5000000) { // 5MB limit
        setSnackbarMessage('Image size should be less than 5MB');
        setSnackbarOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(file);
        newPreviews.push(reader.result);
        setNewReview(prev => ({
          ...prev,
          images: newImages,
          imagesPreviews: newPreviews
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setNewReview(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagesPreviews: prev.imagesPreviews.filter((_, i) => i !== index)
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!newReview.rating || !newReview.comment.trim()) {
      setSnackbarMessage('Please provide both rating and comment');
      setSnackbarOpen(true);
      return;
    }

    const reviewToAdd = {
      id: Date.now(), // Use timestamp as unique ID
      user: {
        name: 'Current User', // In real app, get from auth
        avatar: 'https://example.com/default-avatar.jpg',
      },
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment.trim(),
      images: newReview.imagesPreviews,
      date: new Date().toISOString(),
      helpful: 0,
      isHelpful: false,
      productId: id // Add product ID to associate review with product
    };

    setReviews(prev => [reviewToAdd, ...prev]);
    setNewReview({
      rating: 0,
      title: '',
      comment: '',
      images: [],
      imagesPreviews: []
    });
    setShowReviewForm(false);
    setSnackbarMessage('Review submitted successfully!');
    setSnackbarOpen(true);
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        // Store helpful status in localStorage
        const helpfulStatuses = JSON.parse(localStorage.getItem('reviewHelpfulStatuses') || '{}');
        const newStatus = !review.isHelpful;
        helpfulStatuses[`${id}-${reviewId}`] = newStatus;
        localStorage.setItem('reviewHelpfulStatuses', JSON.stringify(helpfulStatuses));

        return {
          ...review,
          helpful: newStatus ? review.helpful + 1 : review.helpful - 1,
          isHelpful: newStatus
        };
      }
      return review;
    }));
  }
  useEffect(() => {
    const helpfulStatuses = JSON.parse(localStorage.getItem('reviewHelpfulStatuses') || '{}');
    setReviews(prev => prev.map(review => ({
      ...review,
      isHelpful: helpfulStatuses[`${id}-${review.id}`] || false
    })));
  }, [id]);

  const handleAddToCart = (isBuyNow = false) => {
    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0],
      totalPrice: product.price * quantity,
    };

    let existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = existingCart.findIndex((item) => item.id === cartItem.id);

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].totalPrice += product.price * quantity;
    } else {
      existingCart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    if (isBuyNow && onOpenCart) {
      setOpenCartDialog(true);
      onOpenCart();
      navigate();
    }
  };

  const handleConfirmCart = () => {
    const totalPrice = product.price * quantity;

    const cartItem = {
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0],
      totalPrice: totalPrice
    };

    if (buyNow) {
      navigate('/checkout', {
        state: {
          items: [cartItem],
          totalAmount: totalPrice
        }
      });
    } else {
      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex(item => item.id === cartItem.id);

      if (existingItemIndex !== -1) {
        existingCart[existingItemIndex].quantity += quantity;
        existingCart[existingItemIndex].totalPrice += totalPrice;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));
      setOpenCartDialog(false);
    }
  };

    const ReviewForm = () => (
      <Card sx={{ mt: 2, p: 2 }}>
        <CardContent>
          <form onSubmit={handleReviewSubmit}>
            <Typography variant="h6" gutterBottom>
              Write a Review
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={newReview.rating}
                onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value }))}
                size="large"
              />
            </Box>

            <TextField
              fullWidth
              label="Review Title"
              value={newReview.title}
              onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Review Comment"
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              margin="normal"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="review-image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="review-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  disabled={newReview.images.length >= 5}
                >
                  Add Images (Max 5)
                </Button>
              </label>
            </Box>

            {newReview.imagesPreviews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {newReview.imagesPreviews.map((preview, index) => (
                  <Box
                    key={index}
                    sx={{ position: 'relative' }}
                  >
                    <img
                      src={preview}
                      alt={`review-${index}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'background.paper'
                      }}
                      onClick={() => removeImage(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!newReview.rating || !newReview.comment.trim()}
              >
                Submit Review
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    );


  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Box p={4}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        <CloseIcon />
      </IconButton>

      <Grid spacing={4} direction="column" alignItems="center" mx={50}>
        <Grid item xs={12} md={6}>

          <Box display="flex" alignItems="center">
            <IconButton
              onClick={handlePrevImage}
              disabled={currentImageIndex === 0}
            >
              <ArrowLeftIcon />
            </IconButton>
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                gap: 2,
                mb: 4,
                overflow: 'hidden',
                scrollBehavior: 'smooth',
              }}
            >
              {product.images?.length > 0 && (
                <Box sx={{ flexShrink: 0, width: '100%', height: '100%' }}>
                  <img
                    src={product.images[currentImageIndex]}
                    alt={`${product.name}-${currentImageIndex}`}
                    style={{
                      width: '100vw',
                      height: '200px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                </Box>
              )}
            </Box>
            <IconButton
              onClick={handleNextImage}
              disabled={currentImageIndex === product.images?.length - 1}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>
            {product.name}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description || 'No description available'}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h4" color="primary">
                ${product.price?.toFixed(2)}
              </Typography>
              <Typography
                variant="body1"
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
              variant="outlined"
              startIcon={<ShoppingCartIcon />}
              disabled={!product.stock || product.stock <= 0}
              fullWidth
              size="large"
              onClick={() => handleAddToCart(false)}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            <Button variant="outlined" fullWidth size="large" sx={{ mt: 2 }} onClick={() => handleAddToCart(true)}>
              Buy Now
            </Button>
          </Box>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Customer Reviews</Typography>
            {!showReviewForm && (
              <Button
                variant="outlined"
                onClick={() => setShowReviewForm(true)}
              >
                Write a Review
              </Button>
            )}
          </Box>

          {showReviewForm && <ReviewForm />}

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Box key={review.id} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar src={review.user?.avatar} alt={review.user?.name} />
                  <Box>
                    <Typography variant="subtitle1">{review.user?.name}</Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                  <Typography variant="caption" sx={{ ml: 'auto' }}>
                    {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ mt: 1, fontSize: '1rem' }}>
                  {review.title}
                </Typography>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.comment}
                </Typography>

                {review.images?.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`review-${index}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4
                        }}
                      />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Button
                    size="small"
                    onClick={() => handleHelpfulClick(review.id)}
                    sx={{ textTransform: 'none' }}
                  >
                    {review.isHelpful ? 'Helpful • ' : 'Helpful? • '}
                    {review.helpful}
                  </Button>
                </Box>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
          )}
        </Box>
      </Grid>
    </Box>
  );
};

export default PreviewProduct;