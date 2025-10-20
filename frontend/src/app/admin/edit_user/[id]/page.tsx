"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { adminAPI } from "@/utils/adminAPI";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await adminAPI.getUser(params.id);
      setUser(data);
    };
    fetchUser();
  }, [params.id]);

  const handleUpdate = async (data: any) => {
    try {
      await adminAPI.updateUser(params.id, data);
      alert("User updated!");
      router.push("/admin/users");
    } catch {
      alert("Failed to update user.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <main>
      <h2>Edit User</h2>
      <UserForm user={user} onSubmit={handleUpdate} />
    </main>
  );
}
