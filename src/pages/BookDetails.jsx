import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./BookDetails.css";

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const bookResponse = await axios.get(`/api/books/${bookId}`);
        setBook(bookResponse.data);

        const reviewsResponse = await axios.get(`/api/reviews/${bookId}`);
        setReviews(reviewsResponse.data.reviews);

        if (user) {
          const bookmarksResponse = await axios.get(`/api/bookmarks/user`, {
            withCredentials: true,
          });
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

  const handleBookmark = async () => {
    if (!user) {
      alert("You must log in to add bookmarks.");
      navigate("/login");
      return;
    }

    try {
      if (isBookmarked) {
        await axios.delete(`/api/bookmarks/${bookmarkId}`, {
          withCredentials: true,
        });
        setIsBookmarked(false);
        setBookmarkId(null);
        alert("Bookmark removed successfully!");
      } else {
        const response = await axios.post(`/api/bookmarks/${bookId}/add`, {}, { withCredentials: true });
        setIsBookmarked(true);
        setBookmarkId(response.data.bookmark._id);
        alert("Bookmark added successfully!");
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  const handleAddReview = async () => {
    if (!user) {
      alert("You must log in to leave a review.");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `/api/reviews/add`,
        { rating, comment: reviewText, book_id: bookId },
        { withCredentials: true }
      );
      const reviewsResponse = await axios.get(`/api/reviews/${bookId}`);
      setReviews(reviewsResponse.data.reviews);
      setReviewText("");
      setRating(0);
      alert("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
    }
    setIsSubmitting(false);
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <img src={book.cover_image} alt={book.title} className="book-image" />
      </div>
      <div className="book-info">
        <h1 className="book-title">{book.title}</h1>
        <p className="book-description">{book.summary}</p>
        <div className="button-group">
          <button onClick={() => navigate(`/book-reader/${bookId}`)}>Read Now</button>
          <button onClick={handleBookmark}>
            {isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          </button>
        </div>
      </div>
      <div className="reviews-container">
        <h2>Reviews</h2>
        <textarea
          placeholder="Write a review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />
        <div>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              color={i < rating ? "#FFD700" : "#E4E5E9"}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <button onClick={handleAddReview} disabled={isSubmitting || !reviewText || rating === 0}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
        <div>
          {reviews.map((review) => (
            <div key={review._id}>
              <div>
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} color={i < review.rating ? "#FFD700" : "#E4E5E9"} />
                ))}
              </div>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
