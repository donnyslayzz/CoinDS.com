import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Import the router
import "./style.css"; // Global styles

const app = createApp(App);
app.use(router); // Register the router
app.mount("#app"); // Mount the app
