import { useState, useEffect } from "react";


const timezones = {
  US: "America/New_York", 
  France: "Europe/Paris",
  "England & Wales": "Europe/London",
  Canada: "America/Toronto",
  Singapore: "Asia/Singapore",
};

export default function Clock({ country }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTimeByCountry = (country) => {
    const timezone = timezones[country];
    return new Date().toLocaleString("en-US", { timeZone: timezone });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-300 text-white">
      <div className="bg-gray-600 p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Current Time ({country})</h1>
        <p className="text-6xl font-mono">{new Date(getTimeByCountry(country)).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
