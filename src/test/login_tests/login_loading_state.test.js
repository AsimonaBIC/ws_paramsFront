import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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

describe("Login Loading State Test", () => {
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

    test("displays loading spinner during login", async () => {
        axios.post.mockResolvedValueOnce({ data: { status: true, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM' } });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testPassword' } });

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        const loadingSpinner = screen.getByTestId('spinner'); 
        expect(loadingSpinner).toBeInTheDocument();
    });

    test("removes loading spinner after login process completes", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                status: true,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM'
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

        const loadingSpinner = screen.getByTestId('spinner');
        expect(loadingSpinner).toBeInTheDocument();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/table");
        });

        expect(loadingSpinner).not.toBeInTheDocument();
    });
});