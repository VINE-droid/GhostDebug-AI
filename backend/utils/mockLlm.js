async function mockLlm(prompt) {
  return {
    text: `Mock LLM processed: ${prompt}`
  };
}

module.exports = mockLlm;
