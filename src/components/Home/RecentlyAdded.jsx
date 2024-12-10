import { useEffect, useState } from "react";
import BookCard from "../BookCard/BookCard";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const RecentlyAdded = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(baseUrl + "/api/page/home"); // Adjusted endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setLatestBooks(result.latestBooks); // Access the latest books array
      } catch (error) {
        setError("Error fetching recently added books.");
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-8 px-4">
      <h4 className="text-3xl text-yellow-100">Recently added books</h4>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {latestBooks.map((book) => (
            <div key={book._id}>
              <BookCard data={book} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
