# Testing Guide

This document provides an overview of the testing infrastructure for Pakistan Trails App.

## Test Structure

All tests are located outside the `src/` folder to keep them separate from source code:

- **Unit Tests**: `lib/*.test.ts` - Test utility functions and library code
- **Component Tests**: `components/**/*.test.tsx` - Test React components
- **Integration Tests**: `integration/*.test.tsx` - Test critical user flows
- **E2E Tests**: `e2e/*.spec.ts` - End-to-end tests with Playwright

## Running Tests

### Unit and Component Tests (Vitest)

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Coverage

Current coverage goals:
- **Utilities**: 100% coverage
- **Database operations**: 90%+ coverage
- **Components**: 80%+ coverage
- **Overall**: 75%+ coverage

View coverage reports in `coverage/index.html` after running `npm run test:coverage`.

## Mocking

### Supabase

Supabase clients are mocked in `__mocks__/supabase.ts`. Use the mock client helpers:

```typescript
const mockClient = createMockSupabaseClient()
mockClient._setMockData('trails', mockTrails)
mockClient._setMockError('trails', error)
```

### Mapbox GL

Mapbox GL is mocked in `__mocks__/mapbox-gl.ts`. The mock provides:
- Map class
- Marker class
- Popup class
- LngLatBounds class

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from '../src/lib/utils'

describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-01-15')).toMatch(/January 15, 2024/)
  })
})
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../src/components/ui/button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('loads homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Pakistan Trails/)
})
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

The CI pipeline includes:
1. Linting
2. Unit tests
3. Coverage reports
4. Build verification
5. E2E tests

## Best Practices

1. **Keep tests outside src/**: All test files should be in the root-level test directories
2. **Mock external dependencies**: Always mock Supabase, Mapbox, and Next.js APIs
3. **Test behavior, not implementation**: Focus on what the code does, not how
4. **Use descriptive test names**: Test names should clearly describe what they test
5. **Keep tests isolated**: Each test should be independent and not rely on others

## Troubleshooting

### Tests fail with "Cannot find module"

Make sure all dependencies are installed:
```bash
npm install
```

### E2E tests fail

Ensure Playwright browsers are installed:
```bash
npx playwright install --with-deps chromium
```

### Coverage not generating

Check that `@vitest/coverage-v8` is installed and configured in `vitest.config.ts`.

