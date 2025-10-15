import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <ul>
        <li><Link href="/admin/users">👥 View All Users</Link></li>
        <li><Link href="/admin/create-user">➕ Create New User</Link></li>
      </ul>
    </div>
  );
}
