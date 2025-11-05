"use client";

import { useEffect, useState } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "@utils/adminAPI";

interface User {
  id: number;
  username: string;
  role: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "editor",
  });

  // Fetch all users
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers();

        const list = Array.isArray(data)
          ? data
          : data.results || data.users || [];

        setUsers(list);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle create or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id.toString(), formData);
        setUsers(users.map(u => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
      } else {
        const created = await createUser(formData);
        setUsers([...users, created]);
      }
      setFormData({ username: "", password: "", role: "editor" });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ username: user.username, password: "", role: user.role });
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id.toString());
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <main>
      <h1>Admin Page</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!editingUser}
          />
        </div>

        <div>
          <label>Role: </label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button type="submit">{editingUser ? "Update User" : "Create User"}</button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setFormData({ username: "", password: "", role: "editor" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4}>No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}
