import React, { useState, useEffect } from "react";

export default function Register({ onRegistered, currentUser }) {
    const isDoctor = currentUser?.role === "doctor";

    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        role: isDoctor ? "doctor" : "patient",
        specialty: "",
        phone: "",
    });

    const [err, setErr] = useState(null);

    const validateForm = () => {
        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.username)) {
            setErr("Please enter a valid email address.");
            return false;
        }

        // Phone number must be 10 digits
        if (form.phone && !/^\d{10}$/.test(form.phone)) {
            setErr("Phone number must be exactly 10 digits.");
            return false;
        }

        // Password min length
        if (form.password.length < 6) {
            setErr("Password must be at least 6 characters long.");
            return false;
        }

        // Specialty required for doctors
        if (form.role === "doctor" && !form.specialty) {
            setErr("Please enter your specialty.");
            return false;
        }

        return true;
    };

    const submit = async (e) => {
        e.preventDefault();
        setErr(null);

        if (!validateForm()) return;

        if (form.role === "doctor" && !isDoctor) {
            return setErr("Only doctors can register another doctor");
        }

        try {
            const headers =
                form.role === "doctor" && isDoctor
                    ? {
                        "Content-Type": "application/json",
                        "x-auth-token": localStorage.getItem("token"),
                    }
                    : { "Content-Type": "application/json" };

            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers,
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.msg || "Registration failed");

            onRegistered(data.token, data.user);
        } catch (e) {
            setErr(e.message);
        }
    };

    // Automatically hide error after 10 seconds
    useEffect(() => {
        if (err) {
            const timer = setTimeout(() => setErr(null), 10000);
            return () => clearTimeout(timer);
        }
    }, [err]);

    const containerStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        position: "relative",
    };

    const alertStyle = {
        position: "absolute",
        top: "10px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#e63946",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        zIndex: 1000,
    };

    const boxStyle = {
        backgroundColor: "#fff",
        padding: "20px 40px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "500px",
        textAlign: "center",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        margin: "0px 0 15px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
    };

    const labelStyle = {
        display: "block",
        textAlign: "left",
        marginBottom: "5px",
        fontWeight: "bold",
        fontSize: "14px",
    };

    const selectStyle = {
        width: "100%",
        padding: "10px",
        margin: "8px 0 15px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
    };

    const buttonStyle = {
        width: "100%",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#4CAF50",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
    };

    return (
        <div style={containerStyle}>
            {err && <div style={alertStyle}>{err}</div>}

            <div style={boxStyle}>
                <h2 style={{ marginBottom: "20px", fontWeight: "normal" }}>Register</h2>
                <form onSubmit={submit}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            style={inputStyle}
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Email</label>
                        <input
                            style={inputStyle}
                            placeholder="Enter your email"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Password</label>
                        <input
                            style={inputStyle}
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Role</label>
                        <select
                            style={selectStyle}
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                            disabled={!isDoctor}
                        >
                            <option value="patient">Patient</option>
                            {isDoctor && <option value="doctor">Doctor</option>}
                        </select>
                    </div>

                    {form.role === "doctor" && (
                        <div>
                            <label style={labelStyle}>Specialty</label>
                            <input
                                style={inputStyle}
                                placeholder="Enter your specialty"
                                value={form.specialty}
                                onChange={(e) =>
                                    setForm({ ...form, specialty: e.target.value })
                                }
                                required={form.role === "doctor"}
                            />
                        </div>
                    )}

                    <div>
                        <label style={labelStyle}>Phone</label>
                        <input
                            style={inputStyle}
                            placeholder="Enter your 10-digit phone number"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                        />
                    </div>

                    <button type="submit" style={buttonStyle}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
