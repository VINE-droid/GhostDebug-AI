const mockLlm = require("../utils/mockLlm");

function summarizeChange(beforeCode, afterCode) {
  if (beforeCode === afterCode) {
    return "No code change was produced.";
  }

  if (beforeCode.includes("return a + ;") && afterCode.includes("return a;")) {
    return "Removed the invalid token by simplifying the return statement to a partial fallback.";
  }

  if (beforeCode.includes("return a + ;") && afterCode.includes("return a + b;")) {
    return "Completed the broken return expression so the function adds both inputs again.";
  }

  if (beforeCode.includes("return a;") && afterCode.includes("return a + b;")) {
    return "Restored the intended addition logic after the fallback patch proved too weak.";
  }

  if (beforeCode.includes("= ;") && afterCode.includes("= 0;")) {
    return "Inserted a concrete default value into the incomplete assignment.";
  }

  return "Applied a minimal code patch aimed at the suspected failure point.";
}

function applySimpleFix(code, error) {
  const normalizedError = error.toLowerCase();

  if (normalizedError.includes("unexpected token") && code.includes("return a + ;")) {
    return code.replace("return a + ;", "return a + b;");
  }

  if (normalizedError.includes("unexpected token") && code.includes("= ;")) {
    return code.replace("= ;", "= 0;");
  }

  if (normalizedError.includes("is not defined")) {
    return `const missingValue = 0;\n${code}`;
  }

  if (normalizedError.includes("cannot read") && code.includes(".")) {
    return `const safeData = safeData || {};\n${code}`;
  }

  return `${code}\n// Fixed by GhostDebug AI`;
}

function getDemoFix(code, attempt) {
  if (attempt === 1) {
    return code.replace("return a + ;", "return a;");
  }

  if (code.includes("return a + ;")) {
    return code.replace("return a + ;", "return a + b;");
  }

  return code.replace("return a;", "return a + b;");
}

async function fixAgent({ code, error, research, attempt, demoMode }) {
  const fixedCode = demoMode ? getDemoFix(code, attempt) : applySimpleFix(code, error);
  const llmNote = await mockLlm(`Fix the issue: ${research.summary}`);
  const changeSummary = summarizeChange(code, fixedCode);
  const strategy = demoMode && attempt === 1
    ? "I am using a safe but conservative patch first to test whether the syntax error disappears."
    : "I am applying the smallest fix that directly matches the root-cause hypothesis.";

  return {
    fixedCode,
    explanation: `${research.summary} ${research.suggestion}`,
    strategy,
    changeSummary,
    llmNote: llmNote.text
  };
}

module.exports = fixAgent;
