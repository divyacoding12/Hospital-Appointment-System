const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export async function api(path, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
}
