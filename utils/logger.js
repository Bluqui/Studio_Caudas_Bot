function logEvent(message, level = "info") {
    const levels = { info: "ℹ ", error: "❌", success: "✅" };
    console.log(` ${levels[level] || ""} - ${message}`);
}

module.exports = logEvent;