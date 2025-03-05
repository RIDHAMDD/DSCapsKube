
  // useEffect(() => {
  //   axios.get("https://your-vercel-backend.vercel.app/models").then((res) => {
  //     setModels(res.data.models);
  //   });
  // }, []);

  // const handlePredict = async () => {
  //   const response = await axios.post(
  //     "https://your-vercel-backend.vercel.app/predict",
  //     { model_name: selectedModel, content: text }
  //   );
  //   setResult(response.data.prediction);
// };import { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Importing external CSS

export default function App() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [showLinks, setShowLinks] = useState(false);

  useEffect(() => {
    console.log("Fetching models...");
    axios
      .get("http://localhost:5149/models")
      .then((res) => {
        console.log("Received models:", res.data.models);
        setModels(res.data.models);
      })
      .catch((error) => {
        console.error("Error fetching models:", error);
      });
  }, []);

  const handlePredict = async () => {
    console.log("Sending prediction request...");
    console.log("Selected Model:", selectedModel);
    console.log("Input Text:", text);

    try {
      const response = await axios.post("http://localhost:5149/predict", {
        model_name: selectedModel,
        content: text,
      });

      console.log("Received Response:", response.data);
      setResult(response.data.prediction);
    } catch (error) {
      console.error("Error in prediction request:", error);
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header">
        <h2 className="header-title">CS312 (Data Mining) - School Project</h2>
        <p className="team-names">
          Created by <strong>Ridham Dholaria</strong>, <strong>Abdullah Pal</strong>, and <strong>Subhan Ahmed</strong>
        </p>

        {/* Project Links Button */}
        <div className="links-container">
          <button className="links-btn" onClick={() => setShowLinks(!showLinks)}>
            Project Links ⬇
          </button>
          <div className={`dropdown ${showLinks ? "show-dropdown" : ""}`}>
            <a href="https://your-paper-link.com" target="_blank" rel="noopener noreferrer">
              📄 Academic Paper
            </a>
            <a href="https://github.com/your-repo-link" target="_blank" rel="noopener noreferrer">
              💻 GitHub Repository
            </a>
            <a href="https://linkedin.com/in/ridham-dholaria" target="_blank" rel="noopener noreferrer">
              👥 Ridham Dholaria - LinkedIn
            </a>
            <a href="https://linkedin.com/in/abdullah-pal" target="_blank" rel="noopener noreferrer">
              👥 Abdullah Pal - LinkedIn
            </a>
            <a href="https://linkedin.com/in/subhan-ahmed" target="_blank" rel="noopener noreferrer">
              👥 Subhan Ahmed - LinkedIn
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <h1 className="title">AI Content Detector</h1>

      <div className="content-box">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="dropdown-input"
        >
          <option value="">Select Model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>

        <textarea
          className="text-area"
          placeholder="Enter content here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button className="predict-btn" onClick={handlePredict} disabled={!selectedModel || !text}>
          Predict
        </button>

        {result && <p className="result-text">Prediction: {result}</p>}
      </div>
    </div>
  );
}
