function OutputPanel({ result }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Output</h2>
      </div>

      {result ? (
        <div className="output-grid">
          <div className="output-block">
            <span className="output-label">Fixed Code</span>
            <pre>{result.fixedCode}</pre>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span className="output-label">Explanation</span>
              <p>{result.explanation}</p>
            </div>
            <div className="stat-card">
              <span className="output-label">Attempts</span>
              <p>{result.attempts}</p>
            </div>
            <div className="stat-card">
              <span className="output-label">Status</span>
              <p>{result.status}</p>
            </div>
            <div className="stat-card">
              <span className="output-label">Confidence</span>
              <p>{result.confidence}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">Run the workflow to see fixed code and agent output.</div>
      )}
    </section>
  );
}

export default OutputPanel;
