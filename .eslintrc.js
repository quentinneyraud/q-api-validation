module.exports = {
  "extends": "@qneyraud/eslint-config",
  "rules": {
    "no-var": 2,
    "prefer-const": 2,
    "no-console": 0,
    "no-unused-vars": ["error", {
      "varsIgnorePattern": "^_",
      "argsIgnorePattern": "^_"
    }],
    "padded-blocks": ["error", "never"],
    "no-new": 0,
    "import/no-unresolved": [2, {
      "commonjs": true,
      "amd": true
    }]
  }
};
