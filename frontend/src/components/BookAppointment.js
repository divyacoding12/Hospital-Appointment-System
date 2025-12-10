import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function BookAppointment({ token, user }) {
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ doctorId: '', date: '', reason: '' });
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const data = await api('/api/users?role=doctor', 'GET', null, token);
                setDoctors(data);
                if (data[0]) setForm(f => ({ ...f, doctorId: data[0]._id }));
            } catch (e) {
                console.error(e);
            }
        };
        loadDoctors();
    }, [token]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api('/api/appointments/book', 'POST', {
                doctorId: form.doctorId,
                date: form.date,
                reason: form.reason
            }, token);
            setMsg('✅ Appointment booked successfully!');
            setForm({ ...form, date: '', reason: '' }); // reset form fields except doctor
        } catch (e) {
            setMsg('❌ Failed to book appointment');
        }
    };

    // CSS
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        fontFamily: 'Arial, sans-serif'
    };

    const boxStyle = {
        backgroundColor: '#fff',
        padding: '30px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '500px',
        textAlign: 'center',
        marginTop: '5px'
    };

    const labelStyle = {
        display: 'block',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '3px 0 15px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '14px'
    };

    const textareaStyle = {
        ...inputStyle,
        height: '80px', // increased height for reason
        resize: 'none'
    };

    const selectStyle = {
        ...inputStyle
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

    const msgStyle = {
        marginTop: '15px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: msg?.startsWith('✅') ? '#d4edda' : '#f8d7da',
        color: msg?.startsWith('✅') ? '#155724' : '#721c24',
        fontWeight: 'bold'
    };

    return (
        <div style={containerStyle}>
            <div style={boxStyle}>
                <h2 style={{ marginBottom: '20px', fontWeight: 'normal' }}>Book Appointment</h2>
                <form onSubmit={submit}>
                    <div>
                        <label style={labelStyle}>Doctor</label>
                        <select
                            style={selectStyle}
                            value={form.doctorId}
                            onChange={e => setForm({ ...form, doctorId: e.target.value })}
                        >
                            {doctors.map(d => (
                                <option key={d._id} value={d._id}>
                                    {d.name} {d.specialty ? `(${d.specialty})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Date & Time</label>
                        <input
                            style={inputStyle}
                            type="datetime-local"
                            value={form.date}
                            onChange={e => setForm({ ...form, date: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Reason</label>
                        <textarea
                            style={textareaStyle}
                            placeholder="Reason for appointment"
                            value={form.reason}
                            onChange={e => setForm({ ...form, reason: e.target.value })}
                        />
                    </div>

                    <button type="submit" style={buttonStyle}>Book</button>
                </form>

                {msg && <p style={msgStyle}>{msg}</p>}
            </div>
        </div>
    );
}
