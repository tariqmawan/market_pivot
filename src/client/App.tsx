import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./styles/index.css";

// Page components - these will be created
const HomePage = () => <div className="page"><h1>Welcome to MarketsPivot</h1></div>;
const StocksPage = () => <div className="page"><h1>Stock Exchanges</h1></div>;
const CurrenciesPage = () => <div className="page"><h1>Currencies</h1></div>;
const CryptoPage = () => <div className="page"><h1>Cryptocurrencies</h1></div>;
const DashboardPage = () => <div className="page"><h1>Dashboard</h1></div>;

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/stocks/:exchangeId" element={<StocksPage />} />
          <Route path="/currencies" element={<CurrenciesPage />} />
          <Route path="/currencies/:code" element={<CurrenciesPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/crypto/:cryptoId" element={<CryptoPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
