const researchAgent = require("./researchAgent");
const fixAgent = require("./fixAgent");
const reflectionAgent = require("./reflectionAgent");

const MAX_RETRIES = 2;
const DEMO_ERROR = "syntaxerror: unexpected token ';'";

function isDemoMode(code, error) {
  return (
    typeof code === "string" &&
    typeof error === "string" &&
    code.includes("return a + ;") &&
    error.toLowerCase() === DEMO_ERROR
  );
}

function formatConfidence(value) {
  return `${Math.round(value * 100)}%`;
}

async function runDebugWorkflow({ code, error }) {
  const logs = [];
  let attempt = 0;
  let currentCode = code;
  let finalExplanation = "No fix generated.";
  let finalConfidence = 0;
  let status = "failed";
  const demoMode = isDemoMode(code, error);

  logs.push(`🧠 Manager Agent: Received a new debugging task for error "${error}".`);

  if (demoMode) {
    logs.push("🧠 Manager Agent: Demo mode detected. I will show one weak repair first, then retry with a stronger fix.");
  }

  while (attempt <= MAX_RETRIES) {
    attempt += 1;
    logs.push(`🧠 Manager Agent: Attempt ${attempt} of ${MAX_RETRIES + 1}. Plan: research the cause, patch the code, then review the result.`);

    const research = await researchAgent({ code: currentCode, error });
    logs.push(`🔍 Research Agent: I inspected ${research.focusArea}. Finding: ${research.summary}`);
    logs.push(`🔍 Research Agent: Reasoning: ${research.reasoning}`);
    logs.push(`🔍 Research Agent: Recommendation: ${research.suggestion}`);

    const fix = await fixAgent({ code: currentCode, error, research, attempt, demoMode });
    logs.push(`🛠️ Fix Agent: Strategy: ${fix.strategy}`);
    logs.push(`🛠️ Fix Agent: Change applied: ${fix.changeSummary}`);

    const reflection = await reflectionAgent({
      originalCode: currentCode,
      fixedCode: fix.fixedCode,
      error,
      attempt,
      demoMode
    });
    logs.push(`🔁 Reflection Agent: Evaluation: ${reflection.explanation}`);
    logs.push(`🔁 Reflection Agent: Decision: ${reflection.decision.toUpperCase()}. Next action: ${reflection.nextAction}`);

    currentCode = fix.fixedCode;
    finalExplanation = fix.explanation;
    finalConfidence = reflection.confidence;

    if (reflection.success) {
      status = "success";
      logs.push(`✅ Success: Manager accepted the fix after ${attempt} attempt(s) with ${formatConfidence(reflection.confidence)} confidence.`);
      break;
    }

    if (attempt <= MAX_RETRIES) {
      logs.push(`❌ Retry... Manager is starting another pass because attempt ${attempt} did not fully solve the problem.`);
    } else {
      logs.push(`❌ Retry... Max retries reached. Manager is returning the best available fix with ${formatConfidence(reflection.confidence)} confidence.`);
    }
  }

  return {
    status,
    fixedCode: currentCode,
    explanation: finalExplanation,
    attempts: attempt,
    confidence: finalConfidence,
    logs
  };
}

module.exports = runDebugWorkflow;
