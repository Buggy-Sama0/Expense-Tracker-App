import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddExpense from '../components/AddExpense';
import axios from 'axios';
import '@testing-library/jest-dom';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock axios
jest.mock('axios');

// Mock API_URL from config
jest.mock('../config', () => ({
    API_URL: 'http://test-api-url'
}));

describe('AddExpense Component', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    test('renders AddExpense form', () => {
        render(<AddExpense />);
        
        // Check if all form elements are present
        expect(screen.getByText('Add Expense')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Date')).toBeInTheDocument();
          // Check category dropdown
        const categorySelect = screen.getByRole('combobox');
        expect(categorySelect).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Select Category' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Food' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Travel' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Bill' })).toBeInTheDocument();

        // Check buttons
        expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });


    test('can fill out and submit form', async () => {
        const mockResponse = {
            data: {
                message: 'Expense recorded',
                result: {
                    description: 'Test Expense',
                    amount: 100,
                    category: 'Food',
                    date: '2025-05-28'
                }
            }
        };
        axios.post.mockResolvedValueOnce(mockResponse);

        render(<AddExpense />);

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Description'), {
            target: { value: 'Test Expense' }
        });
        fireEvent.change(screen.getByPlaceholderText('Amount'), {
            target: { value: '100' }
        });
        fireEvent.change(screen.getByPlaceholderText('Date'), {
            target: { value: '2025-05-28' }
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'Food' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        // Check if axios.post was called with correct data
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(
                expect.any(String),
                {
                    description: 'Test Expense',
                    amount: '100',
                    category: 'Food',
                    date: '2025-05-28'
                }
            );
        });

        // Check if form was reset
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Description')).toHaveValue('');
            expect(screen.getByPlaceholderText('Amount')).toHaveValue('');
            expect(screen.getByPlaceholderText('Date')).toHaveValue('');
            expect(screen.getByRole('combobox')).toHaveValue('');
        });
    });    test('handles form submission error', async () => {
        // Mock console.log to test error logging
        const consoleSpy = jest.spyOn(console, 'log');
        
        // Mock axios to reject
        const errorMessage = 'Network Error';
        axios.post.mockRejectedValueOnce(new Error(errorMessage));

        render(<AddExpense />);

        // Fill out and submit form
        fireEvent.change(screen.getByPlaceholderText('Description'), {
            target: { value: 'Test Expense' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        // Check if error was logged
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Error: ', expect.any(Error));
        });

        consoleSpy.mockRestore();
    });

    test('reset button clears form', () => {
        render(<AddExpense />);

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText('Description'), {
            target: { value: 'Test Expense' }
        });
        fireEvent.change(screen.getByPlaceholderText('Amount'), {
            target: { value: '100' }
        });
        fireEvent.change(screen.getByPlaceholderText('Date'), {
            target: { value: '2025-05-28' }
        });
        fireEvent.change(screen.getByRole('combobox'), {
            target: { value: 'Food' }
        });

        // Click reset button
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

        // Check if form was reset
        expect(screen.getByPlaceholderText('Description')).toHaveValue('');
        expect(screen.getByPlaceholderText('Amount')).toHaveValue('');
        expect(screen.getByPlaceholderText('Date')).toHaveValue('');
        expect(screen.getByRole('combobox')).toHaveValue('');
    });
});