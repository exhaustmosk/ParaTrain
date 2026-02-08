// template/ai.js
async function loadAIContent() {
  const resultsBox = document.getElementById("ai-test-results");
  const suggestionsBox = document.getElementById("ai-suggestions");

  try {
    const response = await fetch("http://localhost:5000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Generate test results and suggestions for a neurological recovery patient. Assume the patient has given a simulation test and he was able to catch 8 apples from left hand and miss 2 and 4 apples from right hand and miss 6. Give result for this simulation and physio and diet suggestions to the person",
      }),
    });

    const data = await response.json();
    const text = data.content || "⚠️ No response from AI";

    // Extract sections
    const resultsMatch = text.match(/Test Results([\s\S]*?)Suggestions/i);
    const suggestionsMatch = text.match(/Suggestions for Improvement([\s\S]*)/i);

    resultsBox.textContent =
      resultsMatch?.[1]?.trim() || "⚠️ No results generated";

    suggestionsBox.textContent =
      suggestionsMatch?.[1]?.trim() || "⚠️ No suggestions generated";
  } catch (err) {
    console.error("AI fetch failed:", err);
    resultsBox.textContent = "⚠️ Error: Could not load AI results";
    suggestionsBox.textContent = "⚠️ Error: Could not load AI suggestions";
  }
}

document.addEventListener("DOMContentLoaded", loadAIContent);
