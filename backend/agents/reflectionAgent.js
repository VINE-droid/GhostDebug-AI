const mockLlm = require("../utils/mockLlm");

async function reflectionAgent({ originalCode, fixedCode, error, attempt, demoMode }) {
  if (demoMode) {
    const demoSuccess = fixedCode.includes("return a + b;");
    const llmNote = await mockLlm(`Review fix confidence for attempt ${attempt}`);

    if (!demoSuccess) {
      return {
        success: false,
        confidence: 0.42,
        explanation: "The first fix removes the syntax error but weakens the intended logic, so another retry is needed.",
        decision: "retry",
        nextAction: "Ask the Fix Agent to restore the original intent instead of only making the code parse.",
        llmNote: llmNote.text
      };
    }

    return {
      success: true,
      confidence: 0.96,
      explanation: "The second fix restores the full addition logic and should resolve the demo failure.",
      decision: "accept",
      nextAction: "Finalize the answer and return the repaired code to the user.",
      llmNote: llmNote.text
    };
  }

  const codeChanged = originalCode !== fixedCode;
  const normalizedError = error.toLowerCase();

  let confidence = codeChanged ? 0.82 : 0.35;
  let success = codeChanged;
  let explanation = "The fix changed the code and looks likely to resolve the issue.";

  if (!codeChanged) {
    success = false;
    explanation = "The fix did not change the code, so the issue likely remains.";
    confidence = 0.2;
  }

  if (normalizedError.includes("unexpected token") && fixedCode.includes("= ;")) {
    success = false;
    explanation = "The invalid assignment is still present.";
    confidence = 0.15;
  }

  if (attempt > 1 && success) {
    confidence = 0.9;
  }

  const llmNote = await mockLlm(`Review fix confidence for attempt ${attempt}`);

  return {
    success,
    confidence,
    explanation,
    decision: success ? "accept" : "retry",
    nextAction: success
      ? "Return the patched code because the fix looks stable enough."
      : "Send the issue back for another focused repair attempt.",
    llmNote: llmNote.text
  };
}

module.exports = reflectionAgent;
