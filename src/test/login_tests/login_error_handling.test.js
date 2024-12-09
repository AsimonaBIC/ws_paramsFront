import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../pages/login/Login';
import Cookies from 'js-cookie';
import axios from 'axios';

jest.mock('react-router-dom', () => {
    return {
        ...jest.requireActual('react-router-dom'),
        useNavigate: jest.fn(),
    };
});

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

jest.mock('axios');

const mockNavigate = jest.fn();

describe("Login Error Handling Test", () => {
    beforeEach(() => {
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        mockNavigate.mockReset();
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        axios.post.mockReset();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("handles missing token in successful login response", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                status: true, 
            }
        });
    
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
    
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /entrar/i });
    
        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(submitButton);
    
        const errorMessage = await screen.findByText(/token is missing/i); 
        expect(errorMessage).toBeInTheDocument();
    });

    test("shows server error message on server error", async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                status: 500
            }
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /entrar/i });

        fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
        fireEvent.click(submitButton);

        const errorMessage = await screen.findByText(/Server error, please try again later/i);
        expect(errorMessage).toBeInTheDocument();
    });
});