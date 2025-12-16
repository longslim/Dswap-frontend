import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "../../components/axiosInstance";

const BtcChart = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get("/ohlc");

      // Convert OHLC candles → simple line data (using close price)
      const formatted = res.data.map((candle) => ({
        time: new Date(candle.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        price: candle.close,
      }));

      setData(formatted);
    } catch (err) {
      console.error("BTC Chart Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "350px", marginTop: "20px" }}>
      <h3 style={{ marginBottom: "10px" }}>Bitcoin Price Chart (Line)</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />

          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#ff9900"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BtcChart;



// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid
// } from "recharts";
// import api from "../../components/axiosInstance";

// const BtcChart = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     fetchOHLC();
//   }, []);

//   const fetchOHLC = async () => {
//     try {
//       const res = await api.get("/ohlc")

//       const formatted = res.data.candles.map(c => ({
//         time: new Date(c.time).toLocaleTimeString(),
//         price: c.close
//       }));

//       setData(formatted);

//     } catch (err) {
//       console.error("Chart Load Error:", err.message);
//     }
//   };

//   return (
//     <div style={{ width: "100%", height: 400 }}>
//       <h2 style={{ textAlign: "center" }}>BTC Price Chart (Live OHLC)</h2>

//       <ResponsiveContainer>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="time" minTickGap={20} />
//           <YAxis domain={["auto", "auto"]} />
//           <Tooltip />
//           <Line type="monotone" dataKey="price" stroke="#ff9900" dot={false} strokeWidth={2} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default BtcChart;
