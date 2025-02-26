const path = require("path");

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  ignorePatterns: ["projects/**/*"],
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: [
          path.resolve(__dirname, "../admin_metronic_8.2/tsconfig.json"),
        ],
        createDefaultProgram: true,
      },
      extends: [
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates",
      ],
      rules: {
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: "app",
            style: "kebab-case",
          },
        ],
        "@angular-eslint/use-lifecycle-interface": ["off"],
        "no-empty-function": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@angular-eslint/no-empty-lifecycle-method": "off",
        "@angular-eslint/no-input-rename": "off",
      },
    },
  ],
};
