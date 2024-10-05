"use client";

import Modal from "@/components/moda";
import { Data } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Home() {
  const [formValues, setFormValues] = useState({
    code: localStorage.getItem("code") || "",
    xgTeam1: "1.44",
    xgTeam2: "1.44",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResults] = useState<Data>();
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
      setResults(undefined);
      setError(false);
      const response = await fetch(
        `/api?code=${formValues.code}&xg1=${formValues.xgTeam1}&xg2=${formValues.xgTeam2}`
      );
      const data = (await response.json()) as Data;
      if (!data.success) {
        setError(true);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("code", formValues.code);
  }, [formValues.code]);

  useEffect(() => {
    if (error) {
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

      {/* Display results */}
      {result && (
        <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl p-8 mt-6 flex flex-col space-y-5 text-right">
          <h2 className="text-xl font-bold text-gray-800">نتائج التوقعات</h2>
          <div className="space-y-3">
            {/* First Half */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">
                الشوط الأول
              </h3>
              {result.data.firstHalf.map((r, index) => (
                <p key={index} className="text-gray-700">
                  النتيجة المتوقعة: {r.score} - الاحتمال: {r.probability}%
                </p>
              ))}
            </div>

            {/* Second Half */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">
                الشوط الثاني
              </h3>
              {result.data.secondHalf.map((r, index) => (
                <p key={index} className="text-gray-700">
                  النتيجة المتوقعة: {r.score} - الاحتمال: {r.probability}%
                </p>
              ))}
            </div>

            {/* Full Match */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600">
                المباراة كاملة
              </h3>
              {result.data.fullMatch.map((r, index) => (
                <p key={index} className="text-gray-700">
                  النتيجة المتوقعة: {r.score} - الاحتمال: {r.probability}%
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isVisible={isModalVisible} onClose={closeModal}>
        <div className="p-4 max-w-xs sm:max-w-md w-full bg-white rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-center">
            خطأ في الإدخال
          </h2>
          <p className="text-sm sm:text-base text-gray-700 mb-3 text-center">
            يرجى التأكد من أن القيم المدخلة لـ <strong>XG1</strong> و{" "}
            <strong>XG2</strong> هي أرقام صحيحة، وأن الكود صحيح ويعمل بشكل صحيح.
          </p>
          <button
            onClick={closeModal}
            className="w-full mt-4 px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
          >
            إغلاق
          </button>
        </div>
      </Modal>
    </main>
  );
}
