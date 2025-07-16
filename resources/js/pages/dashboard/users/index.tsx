import React from 'react';
import UserList from '@/components/user-list'; // or use inline code
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import { User } from '@/types';

interface Props {
  users: User[];
}

export default function Index({ users }: Props) {
  return (
    <DashboardLayout title="Users" href="/users">
      <Head title="Users" />
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UserList users={users} />
    </DashboardLayout>
  );
}
