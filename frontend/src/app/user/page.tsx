// src/app/users/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // need add new path url pattern in in backend url.py
    fetch("http://localhost:8000/api/users/")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <main>
      <h1>User List</h1>
      <ul>
        {users.map((u: any) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </main>
  );
}
