import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import FundCard from "../components/FundCard";
import axios from "axios";
import { toast } from "react-toastify";

const SavedFunds = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const navigate = useNavigate();

  const fetchFundsApi = async () => {
    try {
      const res = await axios.get(`/api/funds/saved`, {
        withCredentials: true,
      });
      const data = res.data;
      setFunds(data.funds);
      if (data.funds.length === 0 && res.status === 200) {
        setInfoMsg("No saved funds found.");
      } else {
        setInfoMsg("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch saved funds");
    } finally {
      setLoading(false);
    }
  };

  const fetchFunds = async () => {
    setLoading(true);
    setError("");
    setInfoMsg("");
    try {
      await axios.get(`/api/auth/me`, { withCredentials: true });
      await fetchFundsApi();
    } catch {
      setError("Please login to view saved funds.");
      setLoading(false);
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleRemove = async (fundId) => {
    try {
      await axios.delete("/api/funds/remove", {
        data: { fundId },
        withCredentials: true,
      });
      toast.success("Fund removed.");
      setFunds((prev) => prev.filter((f) => f.fundId !== fundId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove fund");
    }
  };

  if (loading) return <Spinner />;
  return (
    <div className="max-w-2xl mx-auto mt-6 md:mt-10 bg-white p-4 md:p-6 rounded shadow">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center md:text-left">
        Your Saved Mutual Funds
      </h2>
      {error && (
        <div className="text-red-600 mb-4 text-center w-full">{error}</div>
      )}
      {infoMsg && (
        <div className="text-blue-600 mb-4 text-center w-full">{infoMsg}</div>
      )}
      <div className="flex flex-col gap-4">
        {funds.map((fund) => (
          <FundCard
            key={fund.fundId}
            fund={fund}
            onClick={() => navigate(`/fund/${fund.fundId}`)}
            className="w-full"
          >
            <button
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 cursor-pointer w-full md:w-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(fund.fundId);
              }}
            >
              Remove
            </button>
          </FundCard>
        ))}
      </div>
    </div>
  );
};

export default SavedFunds;
