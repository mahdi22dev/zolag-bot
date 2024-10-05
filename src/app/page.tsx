"use client";

import { useState } from "react";

export default function Home() {
  const [loading, seLoading] = useState(false);

  const sumbitForm = () => {
    try {
    } catch (error) {
    } finally {
    }
  };
  return (
    <main className="bg-gradient-to-r from-green-500 to-blue-600 w-full p-10 min-h-[100vh] flex flex-col justify-center items-center">
      <form className="bg-white shadow-lg rounded-lg h-96 w-full max-w-lg p-8 flex flex-col justify-center items-center space-y-5">
        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="team1">
            Your code here
          </label>
          <input
            id="team1"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="code"
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="team1">
            XG Team 1
          </label>
          <input
            id="team1"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="Team 1"
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="team2">
            XG Team 2
          </label>
          <input
            id="team2"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="Team 2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200"
        >
          Submit Prediction
        </button>
      </form>
    </main>
  );
}
