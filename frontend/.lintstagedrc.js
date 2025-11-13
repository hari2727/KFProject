module.exports = {
    'src/app/**/*.{ts}': [
        (filenames) => filenames.length > 10 ? 'npm run lint' : `eslint src/app/**/*.{ts} ${filenames.join(' ')}`,
    ]
}
