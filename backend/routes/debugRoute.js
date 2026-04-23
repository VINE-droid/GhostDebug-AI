const express = require("express");
const runDebugWorkflow = require("../agents/managerAgent");

const router = express.Router();

router.post("/", async (req, res) => {
  const { code, error } = req.body || {};

  if (!code || !error) {
    return res.status(400).json({
      status: "error",
      message: "Both code and error are required."
    });
  }

  try {
    const result = await runDebugWorkflow({ code, error });
    return res.json(result);
  } catch (workflowError) {
    return res.status(500).json({
      status: "error",
      message: "Failed to run debug workflow.",
      details: workflowError.message
    });
  }
});

module.exports = router;
