import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/login/Login';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();

describe("<Login />", () => {
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        mockNavigate.mockReset();
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

    test("shows error message on invalid input", async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );
        const submitButton = screen.getByRole('button', { name: /entrar/i });

        fireEvent.click(submitButton);

        const errorMessage = await screen.findByText(/Invalid credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });

    test("logs in successfully with correct credentials and redirects to /table", async () => {
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
    
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/table");
        });
    });
});