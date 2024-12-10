import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./BookStore.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const BookStorePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [booksPerPage, setBooksPerPage] = useState(10);
  const [sortField, setSortField] = useState("title");

  const fetchBooks = () => {
    setLoading(true);
    setError(null);

    const params = {
      page: currentPage,
      limit: booksPerPage,
      sort: sortField,
    };

    if (searchQuery) params.title = searchQuery;
    if (filter && filter !== "all") params.genre = filter;

    axios
      .get(baseUrl + "/api/books", { params })
      .then((response) => {
        setBooks(response.data.books);
        setTotalBooks(response.data.totalBooks);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch books. Please try again later.");
        setLoading(false);
      });
  };

  // Fetch the books whenever currentPage, searchQuery, filter, or sortField changes
  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchQuery, filter, sortField, booksPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (e) => {
    setSortField(e.target.value);
  };

  return (
    <div className="book-store-page">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-black-100">
        Browse our catalogue!
      </h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a book!"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="filter-container">
        <label htmlFor="filter">Filter Books: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
        </select>
      </div>

      <div className="sort-container">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortField}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p>{error}</p>
      ) : books.length === 0 ? (
        <p>No books available at the moment.</p>
      ) : (
        <div className="book-list">
          {books.map((book) => (
            <div key={book._id} className="book-item">
              <img
                src={book.cover_image.trim()}
                alt={book.title}
                className="book-cover"
              />
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Publisher:</strong> {book.publisher}
              </p>
              <p>
                <strong>Published Date:</strong>{" "}
                {new Date(book.publish_date).toDateString()}
              </p>
              <p>{book.summary || "No summary available."}</p>
              <Link to={`/book/${book._id}`}>
                <button className="read-button">Read Now</button>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(totalBooks / booksPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={index + 1 === currentPage ? "active" : ""}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default BookStorePage;
