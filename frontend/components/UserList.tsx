"use client";
import Link from "next/link";

export default function UserList({ users }: { users: any[] }) {
  return (
    <div>
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.role})
            <Link href={`/admin/edit-user/${user.id}`}> Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
