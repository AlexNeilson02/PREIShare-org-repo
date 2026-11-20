import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '.output/**',
      'dist/**',
      'node_modules/**',
      'src/routeTree.gen.ts',
    ],
  },
  tseslint.configs.recommended,
)
