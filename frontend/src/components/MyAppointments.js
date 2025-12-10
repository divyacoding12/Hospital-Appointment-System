import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function MyAppointments({ token, user }) {
    const [appts, setAppts] = useState([]);
    const [err, setErr] = useState(null);

    // Fetch appointments based on role
    const fetchAppts = async () => {
        try {
            // backend handles role-based filtering
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
            // update status locally
            setAppts(appts.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
        } catch (e) {
            setErr(e.msg || 'Cancel failed');
        }
    };

    return (
        <div>
            <h2>Appointments</h2>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            {appts.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul>
                    {appts.map(a => (
                        <li key={a._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
                            <div>
                                <strong>Date:</strong> {new Date(a.date).toLocaleString()}
                            </div>
                            <div>
                                <strong>Doctor:</strong> {a.doctor?.name || '-'}
                            </div>
                            <div>
                                <strong>Patient:</strong> {a.patient?.name || '-'}
                            </div>
                            <div>
                                <strong>Reason:</strong> {a.reason || '-'}
                            </div>
                            <div>
                                <strong>Status:</strong> {a.status}
                            </div>
                            {a.status !== 'cancelled' && (
                                <button onClick={() => cancel(a._id)} style={{ marginTop: '5px' }}>
                                    Cancel
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
