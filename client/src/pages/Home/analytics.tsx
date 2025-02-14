import { useState, useEffect } from "react";
import "./analytics.css";
import CryptoTable from "@components/CryptoTable/CryptoTable";
import { Grid, Typography } from "@mui/material";

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
  const [cryptoData, setCryptoData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/market/stream");
    console.log("Trying to Recive Crypto Data ==>")
    eventSource.onmessage = (event) => {
      console.log("Received SSE data:", event.data);
      try {
        const data: Crypto[] = JSON.parse(event.data); // Parse the data from SSE
        setCryptoData(data); // Update the state with the transformed data
        setLoading(false);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    
    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("Failed to establish a connection to the server.");
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Close the connection when the component unmounts
    };
  }, []);

  return (
    <Grid container xs={10} md={11}>
      <Grid container flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={'12px'} mt={'5px'} mb={'30px'}>
      <Typography fontSize={'40px'} fontWeight={'600'} color={'#F6F6F6'}>
          Analytics
        </Typography>
        <Typography fontSize={'16px'} fontWeight={'500'} color={'#F6F6F6'} sx={{ opacity: '0.7' }}>
          Toro token ecosystem statistics  
        </Typography>
        </Grid>
      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <CryptoTable cryptoData={cryptoData} />
      )}
    </Grid>
  );
};

export default Analytics;
