import styled from "styled-components";

export const Header = styled.div`
    width: 100%;
    background-color: black;
    padding: 1rem 1rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .logo {
        height: 1rem; 
        margin-left: 0rem; 
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

export const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #FFFFFF;

&::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0; 
    width: 0;
    height: 0;
    border-top: 100vh solid transparent; 
    border-right: 100vw solid #151515;
}

    .brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        h1 {
            color: black;
            text-transform: uppercase;
        }
    }

    form {
        position: relative;
        bottom: 4rem;
        display: flex;
        flex-direction: column;
        gap: 4rem;
        background-color: #F19321;
        border-radius: 2rem;
        padding: 8rem 10rem;
        box-shadow: 0 12px 34px rgba(0, 0, 0, 1); 
        border: 0.2rem solid black;

        &::before {
            content: '';
            position: absolute;
            top: 0rem;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 5rem;
            background-color: black;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0.5rem; 
            left: 0.8rem; 
            width: 2.5rem;
            height: 2.5rem;
            background-color: #F19321;
            border-radius: 50%; 
        }

        input {
            background-color: white;
            padding: 1rem;
            border: 0.1rem solid #000000;
            border-radius: 0.8rem;
            color: black;
            width: 100%;
            font-size: 1rem;
        }

        button {
            background-color: black;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            &:hover {
                background-color: #333;
            }
        }
    }
`;
