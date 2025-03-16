const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const COINCAP_API_URL = "https://api.coincap.io/v2/assets";

// ✅ Map common crypto symbols to CoinCap API IDs
const assetMap = {
    btc: "bitcoin",
    eth: "ethereum",
    xrp: "ripple",
    sol: "solana",
    bnb: "binance-coin",
    ada: "cardano",
    usdc: "usd-coin",
    doge: "dogecoin",
    trx: "tron",
    dot: "polkadot",
    link: "chainlink",
};

// ✅ Route to fetch historical price data
app.get("/api/crypto-history", async (req, res) => {
    try {
        let { asset = "bitcoin", interval = "m1" } = req.query;
        asset = assetMap[asset.toLowerCase()] || asset; // Convert asset to correct ID

        // ✅ Fetch data from CoinCap API
        const response = await axios.get(`${COINCAP_API_URL}/${asset}/history`, {
            params: { interval }
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching CoinCap historical data:", error.message);
        res.status(500).json({ error: "Failed to fetch historical data" });
    }
});

// ✅ Route: Fetch Live Price of a Crypto Asset
app.get("/api/crypto-prices", async (req, res) => {
    try {
        let { asset = "bitcoin" } = req.query;
        asset = assetMap[asset.toLowerCase()] || asset; // Convert asset symbol to API ID

        console.log(`🔄 Fetching price for: ${asset}`);

        // ✅ Fetch current price from CoinCap API
        const response = await axios.get(`${COINCAP_API_URL}/${asset}`);

        if (response.data && response.data.data) {
            res.json({
                symbol: asset,
                priceUsd: parseFloat(response.data.data.priceUsd),
                change24h: parseFloat(response.data.data.changePercent24Hr) || 0
            });
        } else {
            console.warn(`⚠️ Invalid response for ${asset}:`, response.data);
            res.status(500).json({ error: "Invalid response from CoinCap API" });
        }
    } catch (error) {
        console.error("❌ Error fetching CoinCap live price:", error.message);
        res.status(500).json({ error: "Failed to fetch live price" });
    }
});

// ✅ Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
