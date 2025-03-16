<template>
  <div class="trading-chart-container">
    <h2 class="text-yellow-400 text-2xl font-bold mb-4">Trading Chart</h2>

    <!-- Crypto Selection -->
    <div class="chart-options">
      <label for="crypto">Select Crypto:</label>
      <select id="crypto" v-model="cryptoSymbol" class="select-box" @change="updateLivePrice">
        <option v-for="coin in cryptoList" :key="coin.id" :value="coin.id">
          {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
        </option>
      </select>
    </div>

    <!-- Time Frame Selector -->
    <div class="timeframe-selector">
      <label for="timeframe">Time Frame:</label>
      <select id="timeframe" v-model="timeFrame" class="select-box" @change="updateChart">
        <option value="live">Live Ticker</option>
        <option value="m15">15 Minutes</option>
        <option value="h1">1 Hour</option>
        <option value="d1">1 Day</option>
      </select>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading">Loading data...</div>

    <!-- Chart Container -->
    <div ref="chartContainer" class="chart"></div>

    <!-- Live Price Display -->
    <div class="live-price">
      <h3>Current Price: 
        <span v-if="livePrice !== null && !isNaN(livePrice)">
          ${{ livePrice.toFixed(2) }}
        </span>
        <span v-else class="loading-price">Loading...</span>
      </h3>
    </div>

    <!-- Trade Buttons -->
    <div class="trade-buttons">
      <button class="buy-button">Buy</button>
      <button class="sell-button">Sell</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { createChart } from "lightweight-charts";
import axios from "axios";

const chartContainer = ref(null);
const chart = ref(null);
const series = ref(null);
const cryptoSymbol = ref("bitcoin");
const timeFrame = ref("m15");
const isLoading = ref(false);
const livePrice = ref(null);
const cryptoList = ref([]); // Store all coins
let updateInterval = null;

/* ✅ Fetch All Supported Coins for Dropdown */
const fetchCryptoList = async () => {
  try {
    console.log("🔄 Fetching available cryptos...");
    const response = await axios.get("https://api.coincap.io/v2/assets");

    if (response.data && response.data.data) {
      cryptoList.value = response.data.data.map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
      }));
      console.log("✅ Loaded crypto list:", cryptoList.value.length, "coins");
    } else {
      console.warn("⚠️ No crypto data available.");
    }
  } catch (error) {
    console.error("❌ Error fetching crypto list:", error.message);
  }
};

/* ✅ Fetch Live Price for Selected Crypto */
const fetchLivePrice = async () => {
  try {
    console.log(`🔄 Fetching live price for: ${cryptoSymbol.value}`);

    const response = await axios.get(`https://api.coincap.io/v2/assets/${cryptoSymbol.value}`);

    if (response.data && response.data.data && response.data.data.priceUsd) {
      livePrice.value = parseFloat(response.data.data.priceUsd);
      console.log(`✅ Updated live price: ${livePrice.value}`);
    } else {
      console.warn(`⚠️ No valid price data for ${cryptoSymbol.value}`);
      livePrice.value = null;
    }
  } catch (error) {
    console.error(`❌ Error fetching live price for ${cryptoSymbol.value}:`, error.message);
    livePrice.value = null;
  }
};

/* ✅ Fetch Historical Data */
const fetchHistoricalData = async () => {
  try {
    isLoading.value = true;
    console.log(`🔄 Fetching historical data for: ${cryptoSymbol.value} (${timeFrame.value})`);

    const response = await axios.get(`https://api.coincap.io/v2/assets/${cryptoSymbol.value}/history`, {
      params: { interval: timeFrame.value },
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      isLoading.value = false;
      return [];
    }

    const rawData = response.data.data.map(item => ({
      time: Math.floor(new Date(item.time) / 1000),
      value: parseFloat(item.priceUsd) || 0
    }));

    isLoading.value = false;
    return rawData;
  } catch (error) {
    console.error("❌ Error fetching historical data:", error.message);
    isLoading.value = false;
    return [];
  }
};

/* ✅ Reset & Initialize Chart */
const resetChart = () => {
  if (chart.value) {
    chart.value.remove();
  }

  chart.value = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth || 800,
    height: 400,
    layout: { background: { color: "#1a1a1a" }, textColor: "#ffffff" },
    grid: { vertLines: { color: "#333" }, horzLines: { color: "#333" } },
  });

  series.value = chart.value.addLineSeries({ color: "#26a69a", lineWidth: 2 });
};

/* ✅ Update Live Price on Selection Change */
const updateLivePrice = () => {
  fetchLivePrice();
};

/* ✅ Update Chart Data */
const updateChart = async () => {
  resetChart();
  const newChartData = await fetchHistoricalData();
  if (newChartData.length > 0 && series.value) {
    series.value.setData(newChartData);
  }
};

/* ✅ Start Updates */
const startUpdates = () => {
  stopUpdates();
  fetchLivePrice();
  updateInterval = setInterval(fetchLivePrice, timeFrame.value === "live" ? 1000 : 10000);
};

/* ✅ Stop Previous Updates */
const stopUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

/* ✅ Watch for Crypto & Time Frame Changes */
watch([cryptoSymbol, timeFrame], async () => {
  updateLivePrice();
  updateChart();
});

/* ✅ Initialize Everything */
onMounted(async () => {
  await fetchCryptoList();
  resetChart();
  startUpdates();
});
</script>

<style scoped>
/* 🎯 Chart Container */
.trading-chart-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 20px;
  text-align: center;
  background: #7A5800;
  border-radius: 10px;
  color: #fff;
}

/* 📊 Chart */
.chart {
  width: 100%;
  height: 400px;
  border: 1px solid #333;
  border-radius: 5px;
  background: #000;
}

/* 📌 Dropdowns */
.select-box {
  font-size: 14px;
  padding: 8px;
  border-radius: 5px;
  background: #222;
  color: white;
  border: 1px solid #FFD700;
  margin: 5px;
}

/* 🔄 Live Price */
.live-price {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.loading-price {
  color: red;
  font-weight: bold;
}

/* 📈 Trade Buttons */
.trade-buttons {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.buy-button, .sell-button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.buy-button {
  background: #26a69a;
  color: white;
}

.sell-button {
  background: #ef5350;
  color: white;
}
</style>
