<script setup>
import { computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const props = defineProps({
  chartData: { type: Object, required: true },
  chartOptions: { type: Object, required: true },
});

const isDataAvailable = computed(() => props.chartData?.labels.length > 0);
</script>

<template>
  <div class="chart-container bg-gray-800 p-4 rounded-lg shadow-md">
    <Line v-if="isDataAvailable" :data="chartData" :options="chartOptions" />
    <p v-else class="text-gray-400 text-center">No data available.</p>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 350px;
}
</style>
