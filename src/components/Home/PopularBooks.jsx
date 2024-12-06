import { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const PopularBooks = () => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + "/api/page/home");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setGenres(result.genres); // Access the genres array with books
      } catch (error) {
        setError("Error fetching popular books by genre.");
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100">Popular Books by Genre</h4>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        genres.map((genre) => (
          <div key={genre._id} className="my-8">
            <h5 className="text-2xl text-yellow-200">{genre.name}</h5>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {genre.books.map((book) => (
                <div key={book._id}>
                  <BookCard data={book} />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PopularBooks;
