import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Table from '../pages/table/Table';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('js-cookie', () => ({
    get: jest.fn(),
}));

jest.mock('axios');

const mockNavigate = jest.fn();

describe("<Table />", () => {
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        mockNavigate.mockReset();
        Cookies.get.mockReset();
        axios.get.mockReset();
    });

    test("renders the component when user cookie is found", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzI3OTg3NDEsImV4cCI6MTczMjgwMjM0MX0.DvaQKmR14jFKRdJxf13Ahdyqlq1irm77AXtsEY-qvDg');

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Parameters Repository/i)).toBeInTheDocument();
        });
    });

    test("fetches and displays programs", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzI3OTg3NDEsImV4cCI6MTczMjgwMjM0MX0.DvaQKmR14jFKRdJxf13Ahdyqlq1irm77AXtsEY-qvDg');

        const programs = [
            {
                name: 'Program1',
                version: 1,
                parameters: [
                    {
                        name: 'Param1',
                        description: 'Description1',
                        ciphered: false,
                        values: [
                            { environment: 'Env1', value: 'Value1' }
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

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Program1/i)).toBeInTheDocument();
        });
    });
/*
    test("fetches and displays programs", async () => {
        // Use a valid base64-encoded JWT payload
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

        const programs = [
            {
                name: 'Program1',
                version: 1,
                parameters: [
                    {
                        name: 'Param1',
                        description: 'Description1',
                        ciphered: false,
                        values: [
                            { environment: 'Env1', value: 'Value1' }
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
            expect(screen.getByText(/Program1/i)).toBeInTheDocument();
        });
    });

    test("handles search functionality", async () => {
        Cookies.get.mockReturnValue('valid.token');

        const programs = [
            {
                name: 'Program1',
                version: 1,
                parameters: [
                    {
                        name: 'Param1',
                        description: 'Description1',
                        ciphered: false,
                        values: [
                            { environment: 'Env1', value: 'Value1' }
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
            expect(screen.getByText(/Program1/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByPlaceholderText(/Search.../i), { target: { value: 'Param1' } });

        await waitFor(() => {
            expect(screen.getByText(/Param1/i)).toBeInTheDocument();
        });
    });

    test("opens and closes modals", async () => {
        Cookies.get.mockReturnValue('valid.token');

        axios.get.mockResolvedValue({
            data: {
                programs: []
            }
        });

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/New Program/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/New Program/i));

        await waitFor(() => {
            expect(screen.getByText(/Insert Program/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Close/i));

        await waitFor(() => {
            expect(screen.queryByText(/Insert Program/i)).not.toBeInTheDocument();
        });
    });

    test("adds a new program", async () => {
        Cookies.get.mockReturnValue('valid.token');

        axios.get.mockResolvedValue({
            data: {
                programs: []
            }
        });

        axios.post.mockResolvedValue({
            data: {
                program: {
                    name: 'NewProgram',
                    version: 1,
                    parameters: []
                }
            }
        });

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/New Program/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/New Program/i));

        await waitFor(() => {
            expect(screen.getByText(/Insert Program/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Program Name/i), { target: { value: 'NewProgram' } });
        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(screen.getByText(/NewProgram/i)).toBeInTheDocument();
        });
    });

    test("edits an existing program", async () => {
        Cookies.get.mockReturnValue('valid.token');

        const programs = [
            {
                name: 'Program1',
                version: 1,
                parameters: []
            }
        ];

        axios.get.mockResolvedValue({
            data: {
                programs
            }
        });

        axios.put.mockResolvedValue({
            data: {
                program: {
                    name: 'Program1',
                    version: 2,
                    parameters: []
                }
            }
        });

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Program1/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Edit/i));

        await waitFor(() => {
            expect(screen.getByText(/Edit Program/i)).toBeInTheDocument();
        });

        fireEvent.change(screen.getByLabelText(/Program Name/i), { target: { value: 'Program1Updated' } });
        fireEvent.click(screen.getByText(/Submit/i));

        await waitFor(() => {
            expect(screen.getByText(/Program1Updated/i)).toBeInTheDocument();
        });
    });

    test("deletes a program", async () => {
        Cookies.get.mockReturnValue('valid.token');

        const programs = [
            {
                name: 'Program1',
                version: 1,
                parameters: []
            }
        ];

        axios.get.mockResolvedValue({
            data: {
                programs
            }
        });

        axios.delete.mockResolvedValue({});

        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Program1/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Delete/i));

        await waitFor(() => {
            expect(screen.getByText(/¿Estás seguro de eliminar el programa/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Eliminar/i));

        await waitFor(() => {
            expect(screen.queryByText(/Program1/i)).not.toBeInTheDocument();
        });
    });*/
});