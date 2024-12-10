import React from "react";
import Hero from "../components/Home/Hero";
import RecentlyAdded from "../components/Home/RecentlyAdded";
import PopularBooks from "../components/Home/PopularBooks";

export const Home = () => {
  return (
    <div className="bg-zinc-900 text-white px-4 sm:px-6 lg:px-10 py-8">
      <Hero />
      <div className="mt-8">
        <RecentlyAdded />
      </div>
      <div className="mt-8">
        <PopularBooks />
      </div>
    </div>
  );
};

export default Home;
