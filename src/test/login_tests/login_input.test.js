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

describe("Login Component", () => {
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

    test("allows the user to input their credentials", () => {
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

        expect(usernameInput.value).toBe('testUser');
        expect(passwordInput.value).toBe('testPassword');
    });

    test("shows error message on invalid credentials", async () => {
        axios.post.mockResolvedValueOnce({ data: { status: false, message: "Invalid credentials" } });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrongUser' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongPassword' } });
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        const errorMessage = await screen.findByText(/invalid credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test("does not submit the form if fields are empty", async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const submitButton = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(submitButton);

        const errorMessage = await screen.findByText(/Please fill in all fields/i);
        expect(errorMessage).toBeInTheDocument();
    });
});