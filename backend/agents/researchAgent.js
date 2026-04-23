const mockLlm = require("../utils/mockLlm");

function getFocusArea(code, error) {
  if (error.toLowerCase().includes("unexpected token")) {
    return code.includes("return") ? "the broken return statement" : "the incomplete expression";
  }

  if (error.toLowerCase().includes("is not defined")) {
    return "the missing identifier";
  }

  if (error.toLowerCase().includes("cannot read")) {
    return "the unsafe property access";
  }

  return "the failing code path";
}

async function researchAgent({ code, error }) {
  const normalizedError = error.toLowerCase();
  let rootCause = "The error likely comes from a mismatch between the code and the expected syntax or variable usage.";
  let suggestion = "Review the failing line and correct the invalid syntax or missing value.";

  if (normalizedError.includes("unexpected token")) {
    rootCause = "There is a syntax error caused by an invalid or incomplete expression.";
    suggestion = "Complete the expression and remove the unexpected token.";
  } else if (normalizedError.includes("is not defined")) {
    rootCause = "A variable or function is being used before it is declared.";
    suggestion = "Declare the missing variable or replace it with an existing identifier.";
  } else if (normalizedError.includes("cannot read")) {
    rootCause = "The code is accessing a property on an undefined or null value.";
    suggestion = "Add a guard clause or initialize the value before reading from it.";
  }

  const llmNote = await mockLlm(`Research the issue: ${error}`);

  return {
    summary: rootCause,
    suggestion,
    focusArea: getFocusArea(code, error),
    reasoning: `I traced the failure back to ${getFocusArea(code, error)} and believe the fastest path is to apply a small targeted change first.`,
    llmNote: llmNote.text,
    originalCode: code
  };
}

module.exports = researchAgent;
