"use client";
import { useState } from "react";
import "@styles/form.css";

export default function UserForm({ onSubmit, user }: { onSubmit: (data: any) => void; user?: any }) {
  const [form, setForm] = useState({
    username: user?.username || "",
    password: "",
    role: user?.role || "user",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{user ? "Update" : "Create"}</button>
    </form>
  );
}
