import React, { useEffect, useState } from "react";

export default function PatientInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/patient");
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUser(data || null);
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setError("Could not load user info");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user info...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <div>
      <h2>User Information</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  );
}
