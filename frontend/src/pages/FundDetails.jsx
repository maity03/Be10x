import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";

const FundDetails = () => {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`https://api.mfapi.in/mf/${id}`);
        const data = res.data;
        if (!data.meta) throw new Error("Fund not found");
        setFund(data);
      } catch (err) {
        setError("Failed to fetch fund details");
      } finally {
        setLoading(false);
      }
    };
    fetchFund();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.post(
        "/api/funds/save",
        {
          fundId: id,
          fundName: fund.meta.scheme_name,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Fund saved!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Please login to save funds.");
        setTimeout(() => navigate("/login"), 1200);
      } else if (err.response && err.response.status === 409) {
        toast.info("This fund is already saved.");
      } else {
        toast.error(err.response?.data?.message || "Failed to save fund");
      }
    }
  };

  if (loading) return <Spinner />;
  if (error)
    return <div className="text-red-600 text-center mt-4 md:mt-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-6 md:mt-10 bg-white p-4 md:p-6 rounded shadow relative">
      <h2 className="text-xl md:text-2xl font-bold mb-2 text-center md:text-left">
        {fund.meta.scheme_name}
      </h2>
      <div className="mb-2 text-gray-600 text-center md:text-left">
        Scheme Code: {fund.meta.scheme_code}
      </div>
      <div className="mb-2 text-gray-600 text-center md:text-left">
        AMC: {fund.meta.fund_house}
      </div>
      <div className="mb-4 text-gray-600 text-center md:text-left">
        Category: {fund.meta.scheme_type} / {fund.meta.scheme_category}
      </div>
      <button
        className="bg-green-600 text-white px-4 md:px-6 py-2 rounded hover:bg-green-700 mb-4 cursor-pointer w-full md:w-auto"
        onClick={handleSave}
      >
        Save
      </button>
      <h3 className="text-lg font-semibold mt-6 mb-2 text-center md:text-left">
        NAV History (latest 5)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border text-xs md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">NAV</th>
            </tr>
          </thead>
          <tbody>
            {fund.data.slice(0, 5).map((nav, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{nav.date}</td>
                <td className="p-2 border">{nav.nav}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FundDetails;
