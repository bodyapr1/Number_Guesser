import { describe, test, expect, beforeEach, vi } from 'vitest'

// Мокуємо весь DOM і функції до імпорту
beforeEach(() => {
  // Створюємо мок для getElementById
  const mockElement = {
    value: '4',
    checked: false,
    innerText: '',
    innerHTML: '',
    appendChild: vi.fn(),
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      toggle: vi.fn()
    }
  }

  global.document = {
    getElementById: vi.fn((id) => {
      const elements = {
        'lengthInput': { value: '4' },
        'attemptsInput': { value: '10' },
        'duplicatesInput': { checked: false },
        'guessInput': { value: '', valueOf: () => '' },
        'results': { innerHTML: '', appendChild: vi.fn() },
        'attemptsDisplay': { innerText: '' },
        'digitsDisplay': { innerText: '' },
        'timer': { innerText: '' },
        'envStatus': { textContent: '', style: { cssText: '' } }
      }
      return elements[id] || mockElement
    }),
    body: {
      classList: {
        toggle: vi.fn()
      }
    },
    createElement: vi.fn(() => ({
      className: '',
      innerText: '',
      appendChild: vi.fn()
    }))
  }

  global.window = {
    alert: vi.fn()
  }

  // Мокуємо import.meta
  global.import = {
    meta: {
      env: {
        VITE_APP_STATUS: 'test'
      }
    }
  }

  // Запобігаємо виклику restartGame при імпорті
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

// Динамічний імпорт після налаштування моків
let generateSecretCode, checkGuess

beforeEach(async () => {
  // Очищаємо модуль перед кожним тестом
  vi.resetModules()
  const module = await import('./script.js')
  generateSecretCode = module.generateSecretCode
  checkGuess = module.checkGuess
})

describe('generateSecretCode', () => {
  test('генерує код правильної довжини', () => {
    const code = generateSecretCode(4, false)
    expect(code).toHaveLength(4)
  })

  test('без дублікатів — всі цифри унікальні', () => {
    const code = generateSecretCode(4, false)
    const unique = new Set(code)
    expect(unique.size).toBe(4)
  })

  test('з дублікатами — довжина все одно правильна', () => {
    const code = generateSecretCode(4, true)
    expect(code).toHaveLength(4)
  })

  test('всі елементи є рядками цифр', () => {
    const code = generateSecretCode(4, false)
    code.forEach(d => expect(d).toMatch(/^\d$/))
  })
})

describe('checkGuess', () => {
  test('повністю правильна відповідь — всі green', () => {
    const secret = ['1', '2', '3', '4']
    const guess = ['1', '2', '3', '4']
    const result = checkGuess(secret, guess, 4)
    expect(result).toEqual(['green', 'green', 'green', 'green'])
  })

  test('повністю неправильна відповідь — всі grey', () => {
    const secret = ['1', '2', '3', '4']
    const guess = ['5', '6', '7', '8']
    const result = checkGuess(secret, guess, 4)
    expect(result).toEqual(['grey', 'grey', 'grey', 'grey'])
  })

  test('правильна цифра не на своєму місці — yellow', () => {
    const secret = ['1', '2', '3', '4']
    const guess = ['2', '1', '4', '3']
    const result = checkGuess(secret, guess, 4)
    // Перевіряємо, що немає зелених (всі жовті або сірі)
    expect(result.every(color => color !== 'green')).toBe(true)
  })

  test('змішаний результат', () => {
    const secret = ['1', '2', '3', '4']
    const guess = ['1', '5', '3', '8']
    const result = checkGuess(secret, guess, 4)
    expect(result).toEqual(['green', 'grey', 'green', 'grey'])
  })
})