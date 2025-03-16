<template>
  <div class="container">
    <h1 class="title">Live Crypto Prices</h1>

    <!-- 🔥 Top 5 Hot Coins (Biggest Gainers in 24h) -->
    <div class="hot-coins">
      <h2 class="hot-title">🔥 Top 5 Hot Coins</h2>
      <ul>
        <li v-for="coin in hotCoins" :key="coin.id">
          <span class="hot-coin">{{ coin.symbol.toUpperCase() }}</span> 
          - 
          <span class="hot-percent" :class="{ 'positive': coin.change > 0, 'negative': coin.change < 0 }">
            +{{ parseFloat(coin.changePercent24Hr || 0).toFixed(2) }}%
          </span>
        </li>
      </ul>
    </div>

    <!-- 🔍 Search Bar -->
    <input type="text" v-model="searchQuery" placeholder="🔍 Search for a coin..." class="search-bar" />

    <!-- 🔄 Crypto Selector Dropdown -->
    <div class="crypto-selector">
      <label for="crypto">Select Crypto:</label>
      <select id="crypto" v-model="selectedCrypto">
        <option v-for="coin in cryptoPrices" :key="coin.id" :value="coin.id">
          {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
        </option>
      </select>
    </div>

    <!-- 💰 Live Price Display -->
    <div class="live-price">
      <h3>
        Current Price: 
        <span v-if="livePrice !== null">${{ livePrice.toFixed(2) }}</span>
        <span v-else class="loading-price">Loading...</span>
      </h3>
    </div>

    <div v-if="cryptoPrices.length">
      <!-- 📌 Top 100 Coins Dropdown -->
      <details class="coin-dropdown">
        <summary>📊 View Top 100 Coins</summary>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price (USD)</th>
              <th>24h Change</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(coin, index) in displayedCoins" :key="coin.id">
              <td>{{ index + 1 }}</td>
              <td>{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</td>
              <td>${{ parseFloat(coin.priceUsd || 0).toFixed(2) }}</td>
              <td :class="{ 'positive': parseFloat(coin.changePercent24Hr) > 0, 'negative': parseFloat(coin.changePercent24Hr) < 0 }">
                {{ parseFloat(coin.changePercent24Hr || 0).toFixed(2) }}%
              </td>
              <td>
                <!-- 📈 Mini Line Chart -->
                <img v-if="coin.history"
                  :src="'https://image-charts.com/chart?cht=ls&chs=80x30&chd=t:' + coin.history.join(',')" 
                  alt="Chart" class="mini-chart" />
              </td>
            </tr>
          </tbody>
        </table>
      </details>

      <!-- 📌 "See More" Button -->
      <button @click="showAll = !showAll" class="see-more-button">
        {{ showAll ? "See Less" : "See More" }}
      </button>
    </div>

    <div v-else>
      <p>Loading prices...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const cryptoPrices = ref([]); // Stores all crypto prices
const selectedCrypto = ref("bitcoin"); // Default to Bitcoin
const showAll = ref(false); // "See More" toggle
const searchQuery = ref(""); // Search input
const hotCoins = ref([]); // Top 5 Hot Coins (Biggest % Gainers in 24H)
const livePrice = ref(null); // Live price of selected coin

/* ✅ Fetch Prices from API */
const fetchLivePrices = async () => {
  try {
    console.log("🔄 Fetching live crypto prices...");

    const response = await axios.get("http://localhost:5000/api/crypto-prices", {
      params: { asset: selectedCrypto.value },
    });

    if (response.data && response.data.priceUsd) {
      livePrice.value = parseFloat(response.data.priceUsd);
      console.log(`✅ Updated live price: ${selectedCrypto.value} -> $${livePrice.value}`);
    } else {
      console.warn(`⚠️ No live price found for ${selectedCrypto.value}`);
      livePrice.value = null;
    }
  } catch (error) {
    console.error("❌ Error fetching live crypto prices:", error.message);
    livePrice.value = null;
  }
};

/* ✅ Fetch Top 100 Cryptos */
const fetchCryptoList = async () => {
  try {
    const response = await axios.get("https://api.coincap.io/v2/assets");
    if (response.data && response.data.data) {
      cryptoPrices.value = response.data.data.slice(0, 100);
    }

    // ✅ Find top 5 gainers based on 24h % change
    hotCoins.value = [...cryptoPrices.value]
      .filter((coin) => coin.changePercent24Hr !== undefined)
      .sort((a, b) => parseFloat(b.changePercent24Hr) - parseFloat(a.changePercent24Hr))
      .slice(0, 5);
  } catch (error) {
    console.error("❌ Error fetching crypto list:", error.message);
    cryptoPrices.value = [];
  }
};

/* ✅ Update Live Price when Crypto Changes */
watch(selectedCrypto, fetchLivePrices);

/* ✅ Fetch Data on Page Load */
onMounted(async () => {
  await fetchCryptoList();
  await fetchLivePrices();
});
</script>

<style scoped>
/* 🔵 Changed All Gold to Blue */
.hot-coins {
  background: #007BFF; /* Bright Blue */
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.5); /* Blue Glow */
  max-width: 600px;
  margin: auto;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.hot-coins:hover {
  transform: scale(1.03);
  box-shadow: 0px 6px 15px rgba(0, 0, 255, 0.7);
}

/* 🔵 Applied to All Gold Sections */
.container {
  background: #007BFF; /* Bright Blue */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 255, 0.5);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.container:hover {
  transform: scale(1.02);
  box-shadow: 0px 6px 15px rgba(0, 0, 255, 0.7);
}

/* ✅ Removed Black Dots */
.hot-coins ul {
  list-style: none;
  padding: 0;
}

/* 📌 Live Price */
.live-price {
  font-size: 18px;
  font-weight: bold;
}

.loading-price {
  color: red;
  font-weight: bold;
}

.positive {
  color: #32CD32;
}

.negative {
  color: #FF4C4C;
}
</style>
