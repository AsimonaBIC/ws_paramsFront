import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import axios from "axios";
import { LoginRoute } from '../../utils/APIRoutes';
import Cookies from 'js-cookie'; 
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/logo2.png';
import { Header, SubHeader, FormContainer } from './LoginStyles';

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

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
    
        if (!username || !password) {
            toast.error("Please fill in all fields", toastOptions);
            return;
        }
    
        setLoading(true);
    
        try {
            console.log('Attempting to login with:', username, password);
            const { data } = await axios.post(LoginRoute, {
                username,
                password,
            });
    
            console.log('Login response:', data);
    
            if (data.status === true) {
                if (!data.token) {
                    toast.error("Token is missing", toastOptions);
                    setLoading(false);
                    return;
                }
    
                Cookies.set('user', data.token, { expires: 7, secure: true, sameSite: 'Strict' });
                console.log('User cookie set:', Cookies.get('user'));
                toast.success("Login successful!", toastOptions);
                console.log('Navigating to table...');
                navigate("/table");
            } else {
                toast.error(data.message || "Invalid credentials", toastOptions);
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("Invalid credentials", toastOptions);
                } else {
                    console.error('Server error:', error.response);
                    toast.error("Server error, please try again later.", toastOptions);
                }
            } else {
                console.error('Unexpected error:', error);
                toast.error("Unexpected error, please try again later.", toastOptions);
            }
        } finally {
            setLoading(false);
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
                    {loading && <div className="spinner" data-testid="spinner"></div>}
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

export default Login;