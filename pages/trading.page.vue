<script setup>
import { ref, onMounted, watch } from "vue";
import { createChart } from "lightweight-charts";
import axios from "axios";

const chartContainer = ref(null);
const cryptoSymbol = ref("BTCUSDT"); // Default trading pair
const chart = ref(null);
const candleSeries = ref(null);

/* ✅ Fetch historical price data from Binance */
const fetchChartData = async () => {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${cryptoSymbol.value}&interval=1h&limit=50`);
    
    if (!response.data || response.data.length === 0) {
      console.warn("⚠️ No valid chart data received.");
      return [];
    }

    return response.data.map(d => ({
      time: d[0] / 1000, // Convert timestamp to seconds
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));
  } catch (error) {
    console.error("❌ Error fetching historical data:", error);
    return [];
  }
};

/* ✅ Initialize the trading chart */
const initializeChart = async () => {
  if (!chartContainer.value) return;

  chart.value = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    height: 400,
    layout: { backgroundColor: "#1e1e1e", textColor: "#fff" },
    grid: { vertLines: { color: "#444" }, horzLines: { color: "#444" } },
  });

  candleSeries.value = chart.value.addCandlestickSeries();

  const chartData = await fetchChartData();
  if (chartData.length > 0) {
    candleSeries.value.setData(chartData);
  }
};

/* ✅ Ensure Chart Updates When Symbol Changes */
watch(cryptoSymbol, async () => {
  if (candleSeries.value) {
    const newChartData = await fetchChartData();
    if (newChartData.length > 0) {
      candleSeries.value.setData(newChartData);
    }
  }
});

/* ✅ Initialize Chart on Page Load */
onMounted(() => {
  initializeChart();
});
</script>

<template>
  <div class="trading-page">
    <h1>Crypto Trading Chart</h1>
    <p>Select a trading pair: (Coming soon!)</p>
    <div ref="chartContainer" class="chart"></div>
  </div>
</template>

<style scoped>
.trading-page {
  max-width: 900px;
  margin: 20px auto;
  text-align: center;
  background: #222;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
}

.chart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}
</style>
