function LogsPanel({ logs }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Execution Logs</h2>
      </div>

      <div className="terminal">
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div key={`${log}-${index}`} className="terminal-line">
              {log}
            </div>
          ))
        ) : (
          <div className="terminal-placeholder">No agent activity yet.</div>
        )}
      </div>
    </section>
  );
}

export default LogsPanel;
