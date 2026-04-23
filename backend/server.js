const express = require("express");
const debugRoute = require("./routes/debugRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/debug", debugRoute);

app.listen(PORT, () => {
  console.log(`GhostDebug backend running on port ${PORT}`);
});
