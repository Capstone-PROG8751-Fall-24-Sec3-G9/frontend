import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import "./BookDetails.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const BookDetails = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);
  const navigate = useNavigate();

  const { user } = useAuth();

  // Fetch book details and reviews
  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await axios.get(`${baseUrl}/api/books/${bookId}`);
        setBook(bookResponse.data);

        const reviewsResponse = await axios.get(
          `${baseUrl}/api/books/${bookId}/reviews`
        );
        setReviews(reviewsResponse.data.reviews);

        if (user) {
          const bookmarksResponse = await axios.get(
            `${baseUrl}/api/users/favorites`,
            {
              withCredentials: true,
            }
          );
          const bookmarks = bookmarksResponse.data;
          const bookmark = bookmarks.find((b) => b.book_id._id === bookId);
          if (bookmark) {
            setIsBookmarked(true);
            setBookmarkId(bookmark._id);
          }
        }
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBookData();
  }, [bookId, user]);

  // Add a review
  const handleAddReview = async () => {
    if (!user) {
      toast("You must log in to add bookmarks.");
      navigate("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${baseUrl}/api/reviews/add`,
        { rating, comment: reviewText, book_id: bookId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReviews((prevReviews) => [...prevReviews, response.data.review]);
      setReviewText("");
      setRating(0);
      alert("Review added successfully!");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("You must log in to leave a review.");
        navigate("/login");
      } else {
        console.error("Error adding review:", error);
        alert("Failed to add review.");
      }
    }
    setIsSubmitting(false);
  };

  // Add to Favorites (Bookmark)
  // Favorite feature is different from the bookmark feature, comment by @yunxinag
  const handleBookmark = async () => {
    if (!user) {
      toast("You must log in to add bookmarks.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.put(
        `${baseUrl}/api/users/favorite/add`,
        {
          book_id: bookId,
        },
      );
      if (response.status === 200) {
        setIsBookmarked(true);
        alert(response.data.message);
      }
    } catch (error) {
      toast(error.response?.data.message);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-details-container">
      {/* Book Details */}
      <div className="book-header">
        <img src={book.cover_image} alt={book.title} className="book-image" />
      </div>
      <div className="book-info">
        <h1 className="book-title">{book.title}</h1>
        <p className="book-description">{book.summary}</p>
        <p className="book-author">Author: {book.author}</p>
        <p className="book-publisher">Publisher: {book.publisher}</p>
        <div className="button-group">
          <button
            className="read-now-button"
            onClick={() => navigate(`/book-reader/${bookId}`)}
          >
            Read Now
          </button>
          <button
            className={`bookmark-button ${isBookmarked ? "bookmarked" : ""}`}
            onClick={handleBookmark}
            disabled={isBookmarked}
          >
            {isBookmarked ? "Bookmarked" : "Add to Favorites"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-container">
        <h2>Reviews</h2>

        {/* Add Review */}
        <div className="add-review">
          <label htmlFor="review-text" className="review-label">
            Write your review:
          </label>
          <textarea
            id="review-text"
            name="review-text"
            placeholder="Write your review..."
            className="review-textarea"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <div className="rating-stars">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                size={24}
                color={index < rating ? "#FFD700" : "#E4E5E9"}
                onClick={() => setRating(index + 1)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
          <button
            onClick={handleAddReview}
            className="add-review-button"
            disabled={isSubmitting || !reviewText || rating === 0}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Display Reviews */}
        <div className="reviews-list">
          {reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <div className="review-stars">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    size={20}
                    color={index < review.rating ? "#FFD700" : "#E4E5E9"}
                  />
                ))}
              </div>
              <p className="review-text">{review.comment}</p>
              <p className="review-author">By: {review.user_id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
