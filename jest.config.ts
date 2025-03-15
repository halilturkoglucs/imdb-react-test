// jest.config.ts

import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  // Move ts-jest config from 'globals' to 'transform' if you'd like to avoid the deprecation warning
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: './tsconfig.app.json' },
    ],
  },

  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/test/__mocks__/fileMock.ts'
  },
};

export default config;
