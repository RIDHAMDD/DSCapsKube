const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); 

app.post("/predict", (req, res) => {
  const { model_name, content } = req.body;

  if (!model_name || !content) {
    return res.status(400).json({
      error: "model_name and content are required",
    });
  }

  console.log("Received prediction request");
  console.log("Model:", model_name);

  /**
   * FIX: Changed path from 'python/predict.py' to './predict.py'
   * based on your actual file structure.
   */
  const pythonScriptPath = path.join(__dirname, "predict.py");

  // Spawn Python process
  const python = spawn("python3", [
    pythonScriptPath,
    model_name,
    content,
  ]);

  let stdoutData = "";
  let stderrData = "";

  python.stdout.on("data", (data) => {
    stdoutData += data.toString();
  });

  python.stderr.on("data", (data) => {
    const errorMsg = data.toString();
    stderrData += errorMsg;
    console.error("Python stderr:", errorMsg);
  });

  python.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).json({
        error: "Python script failed",
        details: stderrData,
      });
    }

    try {
      // In case Python sends back extra whitespace or newlines
      const result = stdoutData.trim();
      console.log("Prediction result:", result);

      res.json({
        model: model_name,
        prediction: result,
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to parse prediction output" });
    }
  });
});

const PORT = process.env.PORT || 5149;
app.listen(PORT, () =>
  console.log(`Backend running on port ${PORT}`)
);