module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@ts-safeql/check-sql': [
      'error',
      {
        connections: [
          {
            // The migrations path:
            migrationsDir: './prisma/migrations',
            targets: [
              {
                // The sql tags that should be checked.
                // either `db.$queryRaw` or `db.$executeRaw`:
                tag: 'prisma.+($queryRaw|$executeRaw)',
                // Transform the query result to array
                transform: '{type}[]',
              },
            ],
          },
        ],
      },
    ],
  },
};
