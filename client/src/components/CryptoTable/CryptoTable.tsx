import React from "react";
import "./index.css";

interface Crypto {
    id: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
  }

interface CryptoTableProps {
  cryptoData: Crypto[];
}

const CryptoTable: React.FC<CryptoTableProps> = ({ cryptoData }) => {
  return (
    <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Crypto</th>
                <th>Price</th>
                <th>Market Cap</th>
                <th>24h Volume</th>
                <th>24h Change</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin, index) => (
                <tr key={coin.id}>
                  <td>{index + 1}</td>
                  <td className="crypto-info">
                    {coin.image && <img src={coin.image} alt={coin.name} className="crypto-logo" />}
                    {coin.name}
                  </td>
                  <td>${coin.current_price.toLocaleString()}</td>
                  <td>${coin.market_cap.toLocaleString()}</td>
                  <td>${coin.total_volume.toLocaleString()}</td>
                  <td
                    className={
                      coin.price_change_percentage_24h < 0 ? "negative" : "positive"
                    }
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default CryptoTable;
