# Copilot Instructions for AutoPartFe

## Import Path Aliases

### Use `#src` alias for all imports from src directory

- ✅ `import { useLogin } from '#src/hooks/auth'`
- ✅ `import { Button } from '#src/components/ui'`
- ❌ `import { useLogin } from '../../../hooks/auth'` (no relative paths)
- ❌ `import { useLogin } from '#src/hooks/auth/index.ts'` (omit /index.ts)

## Code Style

- Use TypeScript for all new files
- Use Tailwind CSS for styling (no custom CSS files)
- Use React hooks for state management
- Functional components only
- Proper TypeScript types and error handling
