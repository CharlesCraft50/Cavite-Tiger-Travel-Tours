import { isAdmin, isDriver } from '@/lib/utils';
import { User } from '@/types';
import { Link, router } from '@inertiajs/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rank'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const itemsPerPage = 10;

  // Define rank order for sorting
  const rankOrder = {
    admin: 1,
    staff: 2,
    driver: 3,
    user: 4
  };

  const filteredUsers = users
    .filter((user) => user.first_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'rank') {
        return rankOrder[a.role] - rankOrder[b.role];
      } else {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      }
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (user: User) => {
    router.delete(route('users.destroy', user.id));
    setUserToDelete(null);
  };

  return (
    <div className="rounded-lg border overflow-x-auto overflow-y-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
          <option value="rank">Sort by Rank</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-400">
        <thead className="bg-gray-50 dark:bg-accent">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Role</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Created At</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Bookings</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total Spent</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-400 bg-white dark:bg-accent">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <span className={clsx(
                    'inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                    isAdmin(user) 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'staff'
                        ? 'bg-blue-100 text-blue-800'
                        : isDriver(user) 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-2">{user.bookings_count ?? 0}</td>
                <td className="px-4 py-2">₱{(user.total_spent ?? 0).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Link
                      href={route('users.show', user.id)}
                      className="btn-primary text-xs cursor-pointer"
                    >
                      View
                    </Link>
                    {user.first_name.toLowerCase() != 'admin' && (
                      <Button
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        className="btn-primary text-xs cursor-pointer py-5"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={clsx(
                'rounded px-3 py-1 text-sm cursor-pointer',
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border text-gray-700'
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="p-4 max-w-md bg-white dark:bg-accent rounded shadow-xl">
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Delete User "{userToDelete?.first_name}"?
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to delete this user? This will also delete all their bookings and related data. This action cannot be undone.
          </DialogDescription>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => userToDelete && handleDelete(userToDelete)}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}