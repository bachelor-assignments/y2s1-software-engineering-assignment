"use client";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { adminAPI } from "@/utils/adminAPI";

export default function CreateUserPage() {
  const router = useRouter();

  const handleCreate = async (data: any) => {
    try {
      await adminAPI.createUser(data);
      alert("User created successfully!");
      router.push("/admin/users");
    } catch (err) {
      alert("Failed to create user.");
    }
  };

  return (
    <main>
      <h2>Create New User</h2>
      <UserForm onSubmit={handleCreate} />
    </main>
  );
}
