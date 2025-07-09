import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Spinner from "../components/Spinner";
import FundCard from "../components/FundCard";

const MFAPI_LIST_URL = "https://api.mfapi.in/mf";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setResults([]);
    setQuery("");
    setError("");
  }, [location.pathname]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);
    try {
      const res = await fetch(MFAPI_LIST_URL);
      const data = await res.json();

      const filtered = data.filter((fund) =>
        fund.schemeName.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      if (filtered.length === 0) setError("No results found");
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-8 px-2 md:pt-16 relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">
        Mutual Fund Search
      </h1>
      <form
        onSubmit={handleSearch}
        className="w-full max-w-md md:max-w-xl flex flex-col md:flex-row mb-6 md:mb-8 gap-2 md:gap-0"
      >
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded border border-gray-300 focus:outline-none"
          placeholder="Search mutual funds by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer w-full md:w-auto"
          disabled={loading}
        >
          Search
        </button>
      </form>
      {loading && <Spinner />}
      {error && (
        <div className="text-red-600 mb-4 text-center w-full">{error}</div>
      )}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((fund) => (
          <FundCard
            key={fund.schemeCode}
            fund={fund}
            onClick={() => navigate(`/fund/${fund.schemeCode}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
