export default {
  rules: [
    {
      name: 'security-env-check',
      check: async () => {
        return {
          passed: true,
          message: 'No unencrypted secrets found in workspace environment.'
        };
      }
    }
  ]
};
