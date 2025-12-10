import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function MyAppointments({ token, user }) {
    const [appts, setAppts] = useState([]);
    const [err, setErr] = useState(null);

    // Fetch appointments
    const fetchAppts = async () => {
        try {
            const data = await api('/api/appointments', 'GET', null, token);
            setAppts(data);
        } catch (e) {
            setErr(e.msg || 'Failed to fetch appointments');
        }
    };

    useEffect(() => {
        if (token) fetchAppts();
    }, [token]);

    const cancel = async (id) => {
        try {
            await api('/api/appointments/cancel', 'POST', { appointmentId: id }, token);
            setAppts(appts.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
        } catch (e) {
            setErr(e.msg || 'Cancel failed');
        }
    };

    // CSS
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px'
    };

    const cardStyle = {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '20px',
        width: '900px',
        marginBottom: '15px'
    };

    const labelStyle = { fontWeight: 'bold' };

    const statusStyle = (status) => ({
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: '5px',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '12px',
        backgroundColor:
            status === 'cancelled' ? '#dc3545' :
                status === 'booked' ? '#007bff' :
                    status === 'completed' ? '#28a745' :
                        '#6c757d'
    });

    const buttonStyle = {
        padding: '8px 12px',
        marginTop: '10px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#dc3545',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    const errorStyle = {
        color: 'red',
        marginBottom: '15px',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>My Appointments</h2>
            {err && <p style={errorStyle}>{err}</p>}
            {appts.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appts.map(a => (
                    <div key={a._id} style={cardStyle}>
                        <div><span style={labelStyle}>Date:</span> {new Date(a.date).toLocaleString()}</div>
                        <div><span style={labelStyle}>Doctor:</span> {a.doctor?.name || '-'}</div>
                        <div><span style={labelStyle}>Patient:</span> {a.patient?.name || '-'}</div>
                        <div><span style={labelStyle}>Reason:</span> {a.reason || '-'}</div>
                        <div><span style={labelStyle}>Status:</span> <span style={statusStyle(a.status)}>{a.status}</span></div>
                        {a.status !== 'cancelled' && (
                            <button style={buttonStyle} onClick={() => cancel(a._id)}>Cancel</button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
