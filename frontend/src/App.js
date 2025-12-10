import React, { useState } from "react";
import "./App.css";

import Register from "./components/Register";
import Login from "./components/Login";
import UsersList from "./components/UsersList";
import BookAppointment from "./components/BookAppointment";
import MyAppointments from "./components/MyAppointments";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [view, setView] = useState("home");

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setView("home");
  };

  return (
    <div className="App">
      <header>

        <div className="flex  gap-2">
          <h1> 🏥  Hospital Management System</h1>
        </div>


        <nav>

          {!token ? (
            <>
              <button onClick={() => setView("register")}>Register</button>
              <button onClick={() => setView("login")}>Login</button>
            </>
          ) : (
            <>
              {user?.role === "doctor" && <button onClick={() => setView("register")}>Add Doctor</button>}
              {user?.role === "doctor" && <button onClick={() => setView("myappts")}>View Appointments</button>}
              {user?.role === "patient" && <button onClick={() => setView("book")}>Book Appointment</button>}
              {user?.role === "patient" && <button onClick={() => setView("myappts")}>My Appointments</button>}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </header>




      {/* Main Content Section */}
      <main>
        {!token && view === "home" && (
          <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
            <p className="text-4xl font-bold text-blue-700 mb-4">
              Welcome to the Hospital Management System 🏥
            </p>
            <p className="text-lg text-gray-600 mb-4 max-w-xl">
              Easily manage your hospital appointments and patient-doctor interactions.
              <br />
              Register as a patient to book appointments or log in as a doctor to manage patients.
            </p>

            {/* New line for appointment info */}
            <p className="text-md text-gray-500 mb-6 max-w-xl">
              📝 To book an appointment, you must first register or login.
            </p>

            <p className="mt-10 text-gray-400 italic max-w-md">
              Secure, simple, and efficient hospital appointment management at your fingertips.
            </p>
          </div>
        )}



        {/* Register */}
        {view === "register" && (
          <Register
            currentUser={user}
            onRegistered={(tok, usr) => {
              // Only update token/user if no one is logged in (new registration by patient)
              if (!user) {
                setToken(tok);
                setUser(usr);
                localStorage.setItem("token", tok);
                localStorage.setItem("user", JSON.stringify(usr));
              }

              // If logged-in doctor added another doctor, just show users list
              if (user?.role === "doctor") {
                setView("users");
              } else {
                setView(usr.role === "doctor" ? "users" : "book");
              }
            }}
          />
        )}

        {/* Login */}
        {view === "login" && (
          <Login
            onLoggedIn={(tok, usr) => {
              setToken(tok);
              setUser(usr);
              localStorage.setItem("token", tok);
              localStorage.setItem("user", JSON.stringify(usr));
              // Redirect based on role
              setView(usr.role === "doctor" ? "users" : "book");
            }}
          />
        )}

        {/* Users List (View Patients / Doctors) */}
        {view === "users" && <UsersList token={token} />}

        {/* Book Appointment */}
        {view === "book" && <BookAppointment token={token} user={user} />}

        {/* My Appointments */}
        {view === "myappts" && <MyAppointments token={token} />}
      </main>
    </div>
  );
}

export default App;
