import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../components/Settings';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';


test('dasgbs fsad0', () => {

    render(<Settings />)

    expect(screen.getByText('Set Budget')).toBeInTheDocument()
})
