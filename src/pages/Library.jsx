import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Library = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("/api/bookmarks/user", { withCredentials: true });
        setBookmarks(response.data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    fetchBookmarks();
  }, [user, navigate]);

  return (
    <div>
      <h1>Your Library</h1>
      <div>
        {bookmarks.map((bookmark) => (
          <div key={bookmark._id}>
            <h2>{bookmark.book_id.title}</h2>
            <button onClick={() => navigate(`/book/${bookmark.book_id._id}`)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library;
