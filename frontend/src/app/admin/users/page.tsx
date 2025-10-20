"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminAPI } from "@/utils/adminAPI";
import UserList from "@/components/UserList";

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError("Failed to load users.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this user?")) {
      await adminAPI.deleteUser(id);
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main>
      <h2>User Management</h2>
      <Link href="/admin/create_user">➕ Create New User</Link>
      <UserList users={users} />
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.username} ({u.role})
            <Link href={`/admin/edit_user/${u.id}`}> ✏️ Edit</Link>
            <button onClick={() => handleDelete(u.id)}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
