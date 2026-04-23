import { useState } from "react";
import DebugForm from "./components/DebugForm";
import LogsPanel from "./components/LogsPanel";
import OutputPanel from "./components/OutputPanel";
import "./App.css";

const demoCode = `function sum(a, b) {
  return a + ;
}`;

const demoError = "SyntaxError: Unexpected token ';'";

function App() {
  const [code, setCode] = useState(demoCode);
  const [error, setError] = useState(demoError);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);

  const handleDemo = () => {
    setCode(demoCode);
    setError(demoError);
    setLogs([]);
    setResult(null);
  };

  const handleRun = async () => {
    if (!code.trim() || !error.trim()) {
      return;
    }

    setLoading(true);
    setLogs([]);
    setResult(null);

    try {
      const response = await fetch("/api/debug", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ code, error })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to run debug workflow.");
      }

      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setResult({
        fixedCode: data.fixedCode || "",
        explanation: data.explanation || "",
        attempts: data.attempts ?? 0,
        status: data.status || "error",
        confidence: data.confidence ?? 0
      });
    } catch (requestError) {
      setLogs([`❌ Retry... ${requestError.message}`]);
      setResult({
        fixedCode: code,
        explanation: requestError.message,
        attempts: 0,
        status: "error",
        confidence: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-section">
        <p className="eyebrow">GhostDebug AI</p>
        <h1>⚡ Autonomous Debugging Agent</h1>
        <p className="hero-copy">AI thinks, acts, and retries autonomously.</p>
      </section>

      <DebugForm
        code={code}
        error={error}
        loading={loading}
        onCodeChange={setCode}
        onErrorChange={setError}
        onRun={handleRun}
        onDemo={handleDemo}
      />

      {loading ? <div className="loading-banner">🤖 Agents are thinking...</div> : null}

      <div className="content-grid">
        <LogsPanel logs={logs} />
        <OutputPanel result={result} />
      </div>
    </main>
  );
}

export default App;
