<template>
  <div class="app-container">
    <!-- 🟡 Sidebar Navigation (Fixed Left) -->
    <aside class="sidebar">
      <h1 class="sidebar-title">CoinDS Home</h1>
      <router-link to="/" class="nav-btn">Home</router-link>
      <router-link to="/wallet" class="nav-btn">Wallet</router-link>
      <router-link to="/trading" class="nav-btn">Trading</router-link>
    </aside>

    <!-- 📌 Main Content (Properly Aligned & Spaced) -->
    <main class="content">
      <div class="content-box">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
/* ✅ Full-Screen Flexbox Layout */
.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #001F3F; /* Navy background */
}

/* 🟡 Sidebar Navigation (Fixed Left) */
.sidebar {
  width: 250px;
  height: 100vh;
  background: #7A5800; /* Dark Gold */
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
}

/* 🏷 Sidebar Title (Bigger Font & Gold Hover Effect) */
.sidebar-title {
  font-size: 2rem; /* Increased font size */
  font-weight: bold;
  color: #FFD700;
  margin-bottom: 20px;
  text-transform: uppercase;
  transition: color 0.3s ease-in-out;
}

.sidebar-title:hover {
  color: #fff; /* White hover effect */
  text-shadow: 0px 0px 10px #FFD700; /* Gold glowing effect */
}

/* 📌 Sidebar Navigation Buttons */
.nav-btn {
  padding: 12px 16px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #FFD700;
  background-color: #013A63;
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
  width: 80%;
  text-align: center;
  text-decoration: none;
  margin-bottom: 10px;
}

.nav-btn:hover {
  background-color: #FFD700;
  color: #001F3F;
}

/* 📌 Main Content (Ensures Proper Spacing) */
.content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px;
  margin-left: 250px; /* Matches sidebar width */
  width: calc(100% - 250px);
  overflow-y: auto;
}

/* 📌 Content Box (Encapsulating Page Content) */
.content-box {
  width: 90%;
  max-width: 1200px; /* Ensures it doesn’t shrink too much */
  background: #7A5800; /* Dark Gold */
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
