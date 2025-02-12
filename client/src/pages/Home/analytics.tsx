import { useState, useEffect } from "react";
import "./analytics.css";
import CryptoTable from "@components/CryptoTable/CryptoTable";

interface Crypto {
  id: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/market/data"); // Replace with your backend API endpoint
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Crypto Market Analytics</h2>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <CryptoTable cryptoData={cryptoData} />
      )}
    </div>
  );
};

export default Analytics;
