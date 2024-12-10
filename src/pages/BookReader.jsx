import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Epub from "epubjs"; // Import EPUB.js
import "../App.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const BookReader = () => {
  const { bookId } = useParams(); // Retrieve bookId from route params
  const [book, setBook] = useState(null); // State for book data
  const viewerRef = useRef(null); // Reference for EPUB rendering container

  // Fetch book data based on bookId
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/books/${bookId}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book data:", error);
      }
    };

    fetchBook();
  }, [bookId]);

  // Render EPUB using EPUB.js
  useEffect(() => {
    if (book && book.file_page.endsWith(".epub")) {
      console.log(29, book)
      const epubBook = Epub(book.file_page); // Initialize EPUB.js with the file URL
      epubBook.renderTo(viewerRef.current); // Render to the designated container
    }
  }, [book]);

  if (!book) {
    return <div>Loading...</div>;
  }

  const isPDF = book.file_page.endsWith(".pdf");
  const isEPUB = book.file_page.endsWith(".epub");

  return (
    <div className="book-reader-container">
      <h1 className="book-title">{book.title}</h1>
      {isPDF ? (
        <iframe
          src={book.file_page}
          title={book.title}
          width="100%"
          height="550px"
          style={{ border: "1px solid #ccc", marginBottom: "20px" }}
        ></iframe>
      ) : isEPUB ? (
        <div
          ref={viewerRef}
          style={{
            width: "100%",
            height: "550px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            overflow: "hidden",
          }}
        ></div>
      ) : (
        <p>
          Sorry, this book format is not supported for inline viewing. Please{" "}
          <a href={book.file_page} download>
            download the book here
          </a>
          .
        </p>
      )}
      <p className="book-summary">{book.summary}</p>
    </div>
  );
};

export default BookReader;
