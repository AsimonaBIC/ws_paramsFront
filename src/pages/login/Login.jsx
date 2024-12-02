import React, { useState } from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios from "axios";
import { LoginRoute } from '../../utils/APIRoutes';
import Cookies from 'js-cookie'; 
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/logo2.png';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: ""
    });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { password, username } = values;
    
        try {
            console.log('Attempting to login with:', username, password);
            const { data } = await axios.post(LoginRoute, {
                username,
                password,
            });
    
            console.log('Login response:', data);
    
            if (data.status === true) {
                Cookies.set('user', data.token, { expires: 7, secure: true, sameSite: 'Strict' });
                console.log('User cookie set:', Cookies.get('user'));
                toast.success("Login successful!", toastOptions);
                console.log('Navigating to table...');
                navigate("/table");
            } else {
                toast.error(data.message || "Invalid credentials", toastOptions);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Invalid credentials", toastOptions);
            } else {
                console.error('Server error:', error);
                toast.error("Server error, please try again later.", toastOptions);
            }
        }
    };

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    return (
        <>
            <Header>
                <img src={logo} alt="Main Logo" className="logo" />
            </Header>
            <SubHeader>
                <img src={logo2} alt="Secondary Logo" className="logo2" />
                <h1>Login</h1>
            </SubHeader>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <input
                        type="text"
                        placeholder='Username'
                        name="username"
                        onChange={(e) => handleChange(e)}
                        autoComplete="username"
                        aria-label="username" 
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        name="password"
                        onChange={(e) => handleChange(e)}
                        autoComplete="current-password"
                        aria-label="password" 
                    />
                    <button type="submit">Entrar</button>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const Header = styled.div`
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

const SubHeader = styled.div`
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

const FormContainer = styled.div`
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

export default Login;
