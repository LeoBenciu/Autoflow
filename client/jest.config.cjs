module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: [
        '<rootDir>/jest-setup.js' 
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '\\.svg$': '<rootDir>/jest-svg-transformer.cjs'
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@testing-library|your-other-esm-packages)/)/'
    ],
};