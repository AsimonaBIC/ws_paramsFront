import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Table from '../../pages/table/Table';
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

describe("Table Render Test", () => {
    beforeEach(() => {
        require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
        mockNavigate.mockReset();
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        axios.get.mockReset();
        axios.post.mockReset();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const login = async () => {
        axios.post.mockResolvedValue({
            data: {
                status: true,
                user: { name: 'testUser' },
                token: 'fakeToken'
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

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/table");
        }, { timeout: 5000 });
    };

    test("logs in and renders the table component", async () => {
        const programs = [
            {
                name: 'nombre_programa',
                version: 2,
                parameters: [
                    {
                        name: 'ciphered_array_parameter',
                        description: 'test parameter with a ciphered array value',
                        ciphered: true,
                        values: [
                            {
                                environment: 'DEV',
                                value: [
                                    'ciphered text value 1 for dev environment',
                                    'ciphered text value 2 for dev environment',
                                    'ciphered text value 3 for dev environment'
                                ]
                            },
                            {
                                environment: 'PROD',
                                value: [
                                    'ciphered text value 1 for prod environment',
                                    'ciphered text value 2 for prod environment',
                                    'ciphered text value 3 for prod environment'
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        axios.get.mockResolvedValue({
            data: {
                status: true,
                programs
            }
        });

        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');

        await login();

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Parameters Repository/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        await waitFor(() => {
            expect(screen.getByText(/nombre_programa/i)).toBeInTheDocument();
        }, { timeout: 5000 });

        console.log(document.body.innerHTML);

    });


    test("fetches and displays programs", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');

        const programs = [
            {
                name: 'nombre_programa',
                version: 2,
                parameters: []
            }
        ];

        axios.get.mockResolvedValue({
            data: {
                programs
            }
        });

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/nombre_programa/i)).toBeInTheDocument();
        });
    });

    test("displays message when no search results are found", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');
  
        const programs = [
            {
                name: 'nombre_programa',
                version: 2,
                parameters: []
            }
        ];
  
        axios.get.mockResolvedValue({
            data: {
                programs
            }
        });
  
        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );
  
        await waitFor(() => {
            expect(screen.getByText(/nombre_programa/i)).toBeInTheDocument();
        });
  
        fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'non_existent_program' } });
  
        await waitFor(() => {
            expect(screen.getByText(/No results found/i)).toBeInTheDocument(); 
        });
    });
});