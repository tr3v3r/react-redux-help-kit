module.exports = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint"],
  "extends": "@react-native-community",
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "react-hooks/exhaustive-deps": [
          "error",
          {
            "additionalHooks": "(useStaticCallback|useUpdateEffect)"
          }
        ]
      }
    }
  ]
 }