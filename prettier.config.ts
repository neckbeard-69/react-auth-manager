export default {
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    printWidth: 80,
    endOfLine: 'lf',
    overrides: [
        {
            files: ['*.json', '*.jsonc', '*.tsx', '*.ts', '*.js'],
            options: { tabWidth: 4 },
        },
    ],
};
