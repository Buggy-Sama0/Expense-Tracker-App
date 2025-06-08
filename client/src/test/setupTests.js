import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { jest, beforeEach, afterEach } from '@jest/globals';

beforeEach(() => {
    // Add any global test setup
});

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});
