<template>
  <div class="w-full max-w-5xl mx-auto mt-8 p-6 bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-white text-center">Crypto Price Chart</h2>

    <div v-if="selectedCoin" class="mt-6">
      <h3 class="text-xl font-semibold text-gray-300">{{ selectedCoin.name }} Price Chart</h3>
      <div class="chart-container">
        <LineChart v-if="chartData.datasets.length" :chart-data="chartData" :chart-options="chartOptions" />
        <p v-else class="text-gray-400 text-center">Loading chart data...</p>
      </div>
    </div>       
    <p v-else class="text-gray-400 text-center mt-4">Select a coin from the list to view its chart.</p>
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "./LineChart.vue";

export default {
  components: { LineChart },
  props: { selectedCoin: Object },
  data() {
    return {
      chartData: { labels: [], datasets: [] },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.1)" }, ticks: { color: "#fff" } },
          y: { grid: { color: "rgba(255, 255, 255, 0.1)" }, ticks: { color: "#fff" } },
        },
        plugins: {
          legend: { labels: { color: "#fff" } },
          tooltip: { enabled: true, backgroundColor: "#1e293b" },
        },
      },
    };
  },
  watch: {
    selectedCoin: {
      immediate: true,
      handler(newCoin) {
        if (newCoin) {
          this.chartData = { labels: [], datasets: [] };
          this.fetchCoinHistory(newCoin.id);
        }
      },
    },
  },
  methods: {
    async fetchCoinHistory(coinId) {
      try {
        const response = await axios.get(`/api/v3/coins/${coinId}/market_chart`, {
          params: { vs_currency: "usd", days: 7, interval: "daily" },
        });
        if (response.data && response.data.prices) {
          this.updateChartData(response.data.prices);
        } else {
          console.warn("No data received from API.");
        }
      } catch (error) {
        console.error("Error fetching coin history:", error);
      }
    },
    updateChartData(prices) {
      this.chartData = {
        labels: prices.map((p) => new Date(p[0]).toLocaleDateString()),
        datasets: [
          {
            label: "Price (USD)",
            data: prices.map((p) => p[1]),
            borderColor: "#FFD700",
            backgroundColor: "rgba(255, 215, 0, 0.2)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>
