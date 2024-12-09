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

describe("Table Error Handling Test", () => {
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

    test("handles error when deleting a program", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');
    
        const programs = [
            {
                name: 'nombre_programa',
                version: 1,
                parameters: []
            }
        ];
    
        axios.get.mockResolvedValue({
            data: {
                programs
            }
        });
    
        axios.delete.mockRejectedValue(new Error('Failed to delete program'));
    
        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByText(/nombre_programa/i)).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByText(/Delete/i));
    
        await waitFor(() => {
            expect(screen.getByText(/¿Estás seguro de eliminar el programa/i)).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByTestId('confirm-delete-button'));
    
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(/Error deleting program/i); 
        });
    });

    test("handles error when creating a new program", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');
    
        axios.post.mockRejectedValue(new Error('Failed to create program'));
    
        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );
    
        fireEvent.click(screen.getByText(/New Program/i));
    
        await waitFor(() => {
            expect(screen.getByText(/Insert Program/i)).toBeInTheDocument(); 
        });
    
        fireEvent.change(screen.getByLabelText(/Program Name/i), { target: { value: 'Test Program' } });
    
        fireEvent.click(screen.getByTestId('submit-button'));
    
        await waitFor(() => {
            expect(screen.getByText(/Error creating program/i)).toBeInTheDocument();
        });
    });

    test("handles error when fetching programs", async () => {
        Cookies.get.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MzMxMzk4OTIsImV4cCI6MTczMzE0MzQ5Mn0.p12kL-tzBR3dOo6gVcpeey7vnCSUGWV5IhRhaqvJBlM');
    
        axios.get.mockRejectedValue(new Error('Network Error'));
    
        render(
            <BrowserRouter>
                <Table />
            </BrowserRouter>
        );
    
        await waitFor(() => {
            expect(screen.getByRole('alert')).toHaveTextContent(/Error fetching programs/i); 
        });
    });
});