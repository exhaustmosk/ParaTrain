// chart.js

document.addEventListener("DOMContentLoaded", async () => {
  const ctx = document.getElementById("recoveryChart").getContext("2d");

  try {
    // Fetch sensor metadata from your server
    const res = await fetch("http://localhost:5000/api/sensor-metadata");
    const sensorData = await res.json();

    if (!sensorData || sensorData.length === 0) {
      console.warn("No sensor data found. Using default data.");
      // Fallback hardcoded data
      const fallbackLabels = ["Session 1", "Session 2"];
      const fallbackLeftHits = [10, 12];
      const fallbackRightHits = [8, 14];
      const fallbackAccuracy = [75, 82];
      renderChart(ctx, fallbackLabels, fallbackLeftHits, fallbackRightHits, fallbackAccuracy);
      return;
    }

    // Generate labels and data arrays dynamically
    const labels = sensorData.map((_, i) => `Session ${i + 1}`);
    const leftHits = sensorData.map(d => d.left_hit ?? 0);
    const rightHits = sensorData.map(d => d.right_hit ?? 0);
    const accuracy = sensorData.map(d => d.accuracy ?? 0);

    // Render chart
    renderChart(ctx, labels, leftHits, rightHits, accuracy);

  } catch (err) {
    console.error("Error fetching sensor data:", err);
  }
});

// Function to render chart
function renderChart(ctx, labels, leftHits, rightHits, accuracy) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Left Hits",
          data: leftHits,
          borderColor: "#00A8D8",
          backgroundColor: "rgba(0,168,216,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#00A8D8",
          pointBorderColor: "#fff"
        },
        {
          label: "Right Hits",
          data: rightHits,
          borderColor: "#FF6B6B",
          backgroundColor: "rgba(255,107,107,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#FF6B6B",
          pointBorderColor: "#fff"
        },
        {
          label: "Accuracy (%)",
          data: accuracy,
          borderColor: "#6BCB77",
          backgroundColor: "rgba(107,203,119,0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: "#6BCB77",
          pointBorderColor: "#fff"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: { color: "#333" }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#6B7280" }
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#6B7280", stepSize: 10 },
          grid: { color: "rgba(0,0,0,0.04)" }
        }
      }
    }
  });
}
