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

          {result.alternatives && result.alternatives.length > 0 && (
            <div className="output-block alternatives-block">
              <span className="output-label">Alternative Fixes Considered</span>
              <div className="alternatives-list">
                {result.alternatives.map((alt, index) => (
                  <div key={index} className="alternative-item">
                    <p className="alternative-desc">💡 {alt.description}</p>
                    <pre className="alternative-code">{alt.code}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}

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
