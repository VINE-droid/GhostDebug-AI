function DebugForm({
  code,
  error,
  loading,
  onCodeChange,
  onErrorChange,
  onRun,
  onDemo
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Input</h2>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Code</span>
          <textarea
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            placeholder="Paste broken code here..."
            rows={12}
          />
        </label>

        <label className="field">
          <span>Error</span>
          <input
            type="text"
            value={error}
            onChange={(event) => onErrorChange(event.target.value)}
            placeholder="Enter the error message..."
          />
        </label>

        <div className="button-row">
          <button type="button" className="primary-button" onClick={onRun} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
          <button type="button" className="secondary-button" onClick={onDemo} disabled={loading}>
            Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default DebugForm;
