
import { useState } from "react";

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/${
          isRegister ? "register" : "login"
        }`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister
              ? { username: username.trim(), email: email.trim(), password }
              : { userId: userId.trim(), password }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      onLogin(data);
    } catch (error) {
      setMessage(error.message || "Server se connection nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.logo}>♥</div>
        <h1 style={styles.title}>Milap</h1>
        <p style={styles.subtitle}>
          har taiyari, ab ek hi jagah.
        </p>

        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>

        {isRegister ? (
          <>
            <input
              style={styles.input}
              placeholder="Username (lowercase, numbers, _)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              pattern="[a-z0-9_]{3,30}"
              title="3–30 characters: lowercase letters, numbers or underscores"
              autoComplete="username"
              required
            />
            <input
              style={styles.input}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </>
        ) : (
          <input
            style={styles.input}
            placeholder="Username or email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            autoComplete="username"
            required
          />
        )}

        <input
          style={styles.input}
          type="password"
          placeholder="Password (minimum 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          maxLength={72}
          autoComplete={isRegister ? "new-password" : "current-password"}
          required
        />

        {message && <p style={styles.error} role="alert">{message}</p>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
        </button>

        <p style={styles.switchText}>
          {isRegister ? "Already registered? " : "New user? "}
          <button
            type="button"
            style={styles.link}
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setPassword("");
            }}
          >
            {isRegister ? "Login" : "Create account"}
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
    background: "linear-gradient(135deg, #fff1f2, #fff7ed)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 30,
    boxSizing: "border-box",
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 12px 40px rgba(0,0,0,0.10)",
  },
  logo: {
    textAlign: "center",
    color: "#be123c",
    fontSize: 40,
  },
  title: {
    textAlign: "center",
    color: "#881337",
    fontSize: 25,
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
  },
  input: {
    width: "100%",
    padding: 13,
    marginTop: 13,
    boxSizing: "border-box",
    border: "1px solid #ddd",
    borderRadius: 9,
    fontSize: 15,
  },
  button: {
    width: "100%",
    padding: 14,
    marginTop: 20,
    border: "none",
    borderRadius: 9,
    background: "#be123c",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "#be123c",
    background: "#fff1f2",
    padding: 10,
    borderRadius: 8,
  },
  switchText: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
  },
  link: {
    border: "none",
    background: "transparent",
    color: "#be123c",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
