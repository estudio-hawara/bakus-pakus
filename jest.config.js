module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
        '^@railroad/(.*)$': '<rootDir>/src/railroad/$1'
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.spec.{js,jsx,ts,tsx}',
        '!src/index.{js,jsx,ts,tsx}'
    ]
};