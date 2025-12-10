import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function Login({ onLoggedIn }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const data = await api('/api/auth/login', 'POST', form);
            onLoggedIn(data.token, data.user);
        } catch (e) {
            setErr(e.msg || 'Login failed');
        }
    };

    // Automatically clear error after 10 seconds
    useEffect(() => {
        if (err) {
            const timer = setTimeout(() => setErr(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [err]);

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        fontFamily: 'Arial, sans-serif',
        position: 'relative'
    };

    const alertStyle = {
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#e63946',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 1000
    };

    const boxStyle = {
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '400px',
        textAlign: 'center'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px',
        marginBottom: '15px'
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
    };

    return (
        <div style={containerStyle}>
            {err && <div style={alertStyle}>{err}</div>}

            <div style={boxStyle}>
                <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>Login</h2>
                <form onSubmit={submit}>
                    <input
                        style={inputStyle}
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={inputStyle}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>
            </div>
        </div>
    );
}
