"use client";

import Modal from "@/components/moda";
import { useEffect, useState } from "react";

export default function Home() {
  const [formValues, setFormValues] = useState({
    code: localStorage.getItem("code") || "",
    xgTeam1: "",
    xgTeam2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch(
        `/api?code=${formValues.code}&xg1=${formValues.xgTeam1}&xg2=${formValues.xgTeam2}`
      );
      setError(true);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("code", formValues.code);
  }, [formValues.code]);

  useEffect(() => {
    if (!isModalVisible) {
      setIsModalVisible(true);
    }
  }, [error]);

  return (
    <main className="bg-gradient-to-r from-green-500 to-blue-600 w-full p-10 min-h-[100vh] flex flex-col justify-center items-center">
      <form
        onSubmit={submitForm}
        className="bg-white shadow-lg rounded-lg h-96 w-full max-w-lg p-8 flex flex-col justify-center items-center space-y-5"
      >
        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="code">
            Your code here
          </label>
          <input
            id="code"
            type="text"
            value={formValues.code}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="Code"
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="xgTeam1">
            XG Team 1
          </label>
          <input
            id="xgTeam1"
            type="number"
            value={formValues.xgTeam1}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="Team 1"
          />
        </div>

        <div className="flex flex-col w-full gap-2">
          <label className="text-gray-700 font-semibold" htmlFor="xgTeam2">
            XG Team 2
          </label>
          <input
            id="xgTeam2"
            type="number"
            value={formValues.xgTeam2}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            placeholder="Team 2"
          />
        </div>

        <button
          type="submit"
          className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Prediction"}
        </button>
      </form>

      {/* Modal */}
      <Modal isVisible={isModalVisible} onClose={closeModal}>
        <h2 className="text-2xl font-semibold mb-4">Captivating Content</h2>
        <p>
          In this labyrinth of a modal, you’ll find an intricate experience.
        </p>
        <button
          onClick={closeModal}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Close
        </button>
      </Modal>
    </main>
  );
}
