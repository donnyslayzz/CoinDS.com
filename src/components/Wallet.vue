<template>
  <div class="p-6 bg-gray-900 min-h-screen text-white">
    <!-- Header -->
    <h1 class="text-4xl font-bold text-center mb-6 text-yellow-400">My Wallet</h1>

    <!-- Wallet Connection -->
    <div class="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-semibold text-yellow-300">Connected Wallet</h2>
      
      <div v-if="walletConnected" class="mt-4">
        <p class="text-yellow-400 font-bold">{{ walletAddress }}</p>
        <button @click="disconnectWallet" class="wallet-button bg-red-500 hover:bg-red-600 mt-4">
          Disconnect Wallet
        </button>
      </div>
      
      <div v-else class="flex flex-col space-y-3 mt-4">
        <button @click="connectPhantom" class="wallet-button bg-purple-600 hover:bg-purple-700">
          Connect Phantom Wallet
        </button>
        <button @click="connectMetaMask" class="wallet-button bg-yellow-500 hover:bg-yellow-600">
          Connect MetaMask Wallet
        </button>
      </div>
    </div>

    <!-- Wallet Balance -->
    <div v-if="walletConnected" class="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg text-center mt-6">
      <h2 class="text-2xl font-semibold text-yellow-300">Total Balance</h2>
      <p class="text-4xl font-bold text-yellow-400 mt-2">${{ totalBalance }}</p>
    </div>

    <!-- Crypto Holdings Table -->
    <h2 v-if="walletConnected" class="text-2xl font-semibold text-center mt-8 mb-4 text-gray-300">My Holdings</h2>
    <div v-if="walletConnected" class="overflow-x-auto">
      <table class="w-full max-w-4xl mx-auto text-md text-left border border-gray-700 shadow-lg rounded-lg">
        <thead>
          <tr class="bg-gray-800 text-yellow-400">
            <th class="p-3">Coin</th>
            <th class="p-3">Amount</th>
            <th class="p-3">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="holding in holdings" :key="holding.id" class="hover:bg-gray-800 transition-all duration-300">
            <td class="p-3 flex items-center space-x-2">
              <img :src="holding.image" class="w-6 h-6 rounded-full shadow-md" />
              <span class="font-medium text-white">{{ holding.name }}</span>
            </td>
            <td class="p-3 font-semibold text-gray-300">{{ holding.amount }}</td>
            <td class="p-3 font-semibold text-yellow-400">${{ holding.value.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Message when no wallet is connected -->
    <p v-if="!walletConnected" class="text-center text-gray-400 mt-6">
      Connect a wallet to view your balance and holdings.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      walletConnected: false,
      walletAddress: "",
      totalBalance: 0,
      holdings: [],
    };
  },
  methods: {
    // ✅ Connect Phantom Wallet
    async connectPhantom() {
      if (window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect();
          this.walletAddress = response.publicKey.toString();
          this.walletConnected = true;
          this.fetchSolanaHoldings();
        } catch (error) {
          console.error("Phantom Connection Error:", error);
        }
      } else {
        alert("Phantom Wallet not found. Please install Phantom.");
      }
    },

    // ✅ Connect MetaMask Wallet
    async connectMetaMask() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          this.walletAddress = accounts[0];
          this.walletConnected = true;
          this.fetchEthereumHoldings();
        } catch (error) {
          console.error("MetaMask Connection Error:", error);
        }
      } else {
        alert("MetaMask Wallet not found. Please install MetaMask.");
      }
    },

    // ✅ Fetch Solana Holdings from Phantom
    async fetchSolanaHoldings() {
      // Placeholder API for demo (You would use Solana RPC)
      this.holdings = [
        { id: "sol", name: "Solana", amount: 2.5, value: 130, image: "https://cryptoicons.org/api/icon/sol/32" },
        { id: "usdc", name: "USDC (Solana)", amount: 500, value: 1, image: "https://cryptoicons.org/api/icon/usdc/32" },
      ];
      this.totalBalance = 2.5 * 130 + 500 * 1; // Example calculation
    },

    // ✅ Fetch Ethereum Holdings from MetaMask
    async fetchEthereumHoldings() {
      // Placeholder API for demo (You would use Ethers.js or Web3.js)
      this.holdings = [
        { id: "eth", name: "Ethereum", amount: 1.2, value: 2600, image: "https://cryptoicons.org/api/icon/eth/32" },
        { id: "usdc", name: "USDC (Ethereum)", amount: 1000, value: 1, image: "https://cryptoicons.org/api/icon/usdc/32" },
      ];
      this.totalBalance = 1.2 * 2600 + 1000 * 1; // Example calculation
    },

    // ✅ Disconnect Wallet
    disconnectWallet() {
      this.walletConnected = false;
      this.walletAddress = "";
      this.totalBalance = 0;
      this.holdings = [];
    },
  },
};
</script>

<style scoped>
/* ✅ Wallet Buttons */
.wallet-button {
  @apply px-6 py-2 text-black rounded-lg shadow-md transition duration-300 font-semibold;
}

/* ✅ Table Styling */
table {
  border-spacing: 0;
}

th, td {
  border-bottom: 1px solid #444;
}

tr:last-child td {
  border-bottom: none;
}
</style>
