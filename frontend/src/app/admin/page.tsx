"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/users/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <main>
      <h1>Admin - User List</h1>
      <a href="/admin/create-user">Create New User</a>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.username} ({u.role})
            <a href={`/admin/edit-user/${u.id}`}>Edit</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
