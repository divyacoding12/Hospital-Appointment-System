import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function UsersList({ token }) {
    const [role, setRole] = useState('doctor');
    const [users, setUsers] = useState([]);
    const [err, setErr] = useState(null);

    const fetchUsers = async () => {
        try {
            const data = await api(`/api/users?role=${role}`, 'GET', null, token);
            setUsers(data);
        } catch (e) {
            setErr(e.msg || 'Failed to load users');
        }
    };

    useEffect(() => { if (token) fetchUsers(); }, [role, token]);

    return (
        <div>
            <h2>Users</h2>
            <label>Show:
                <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="doctor">Doctors</option>
                    <option value="patient">Patients</option>
                </select>
            </label>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            <ul>
                {users.map(u => (
                    <li key={u._id}>
                        <strong>{u.name}</strong> ({u.username}) - {u.role} {u.specialty ? `| ${u.specialty}` : ''} {u.phone ? `| ${u.phone}` : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}
