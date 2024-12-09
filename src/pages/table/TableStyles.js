import styled from 'styled-components';

export const VersionText = styled.span`
    font-size: 0.8rem;
    color: #ccc;
    padding: 0.5rem 1rem;
`;

export const DeleteButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #EC122C; 
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #DC143C; 
    }
    &:focus {
        outline: none;
    }
`;

export const EditButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #6495ED;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #4495ED; 
    }
    &:focus {
        outline: none;
    }
`;

export const InsertButton = styled.button`
    position: absolute;
    top: 1rem; 
    right: 2rem; 
    z-index: 2; 
    padding: 0.5rem 1rem;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #218838; 
    }
    &:focus {
        outline: none;
    }
`;

export const UserInfo = styled.div`
    color: white;
    margin-right: 3rem;
`;

export const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#fff',
        maxWidth: '800px',
        maxHeight: '600px',
        margin: 'auto',
        border: 'none',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        fontFamily: '"Funnel Sans", sans-serif',
    },
};

export const ExitButton = styled.button`
    position: absolute;
    top: 0.8rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`;

export const Header = styled.div`
    width: 100%;
    background-color: black;
    padding: 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; 

    .logo {
        height: 1rem;
    }

    .search-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 25%; 
        display: flex;
        justify-content: center;
    }

    .search-input {
        width: 100%; 
        padding: 0.2rem;
        border: 1px solid #555;
        border-radius: 0.5rem;
        background-color: white;
        color: black;
        font-size: 1rem;
    }
`;

export const SubHeader = styled.div`
    width: 100%;
    background-color: #F19321;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .logo2 {
        height: 2.5rem; 
    }

    h1 {
        color: white;
        font-size: 2rem;
        margin: 0;
    }
`;

export const TableContainer = styled.div`
    position: relative;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #7c7c7c;
    border-radius: 2rem;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 1);
    border: 0.2rem solid black;
    max-width: 90%;
    max-height: 70vh; 
    overflow-y: auto;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 5rem;
        background-color: black;
        border-top-left-radius: 1.5rem;
        border-top-right-radius: 0.5rem;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0.5rem;
        left: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        background-color: #F19321;
        border-radius: 50%;
        z-index: 1;
    }
`;

export const Program = styled.div`
    margin-bottom: 2rem;
    padding: 0.5rem; 
    border-radius: 0.5rem;
    margin-top: 4rem;
`;

export const ProgramHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4a4a4a;
    color: white;
    padding: 0.5rem 1rem; 
    border-radius: 0.5rem;
`;

export const ProgramTitle = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    h2 {
        margin: 0;
        margin-right: 0.5rem;
    }
`;

export const ProgramDetails = styled.div`
    margin-left: 1rem;
    padding: 0.5rem;
`;

export const Parameter = styled.div`
    margin-left: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

export const ParameterHeader = styled.div`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    background-color: #6a6a6a;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

export const Value = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
  padding: 0.5rem;
  border-left: 2px solid #000;
  background-color: #d0d0d0;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;

  &:not(:last-child) {
    border-bottom: 1px solid #000;
  }

  p {
    margin: 0.5rem 0;
  }
`;

export const ValueHeader = styled.div`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    background-color: #6a6a6a;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

export const ParameterDetails = styled.div`
  margin-left: 1rem;
  padding: 0.5rem;
  border-left: 2px solid #000;
  background-color: #d0d0d0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
  }
`;

export const ValueDetails = styled.div`
  margin-left: 1rem;
  padding: 0.5rem;
  border-left: 2px solid #000;
  background-color: #d0d0d0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
  }
`;

export const Arrow = styled.span`
    font-size: 1.5rem;
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const styles = `
    .highlight {
        background-color: yellow;
        color: black;
        font-weight: bold;
    }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);