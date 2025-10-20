"use client";
import { useState } from "react";

export default function AssetForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [form, setForm] = useState({ name: "", description: "", file: null });

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Asset Name" onChange={handleChange} />
      <textarea name="description" placeholder="Description" onChange={handleChange} />
      <input type="file" name="file" onChange={handleChange} />
      <button type="submit">Upload</button>
    </form>
  );
}
