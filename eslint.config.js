import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    rules: {
    'no-unused-vars': ['warn', { 
        varsIgnorePattern: 'makeGuess|toggleTheme|openSettings|closeSettings|applySettings|restartGame'
    }],
    'no-console': 'warn',
    'no-undef': 'off'
    },
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
        alert: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        parseInt: 'readonly'
      }
    }
  }
]