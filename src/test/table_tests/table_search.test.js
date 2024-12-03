import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Table from '../../pages/table/Table';
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

describe("Table Search Test", () => {
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

    test("handles search functionality", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');

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

        fireEvent.click(screen.getByText(/nombre_programa/i));

        fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'ciphered_array_parameter' } });

        await waitFor(() => {
            expect(screen.getByText(/ciphered_array_parameter/i)).toBeInTheDocument();
        });
    });
});