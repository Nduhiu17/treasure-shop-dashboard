import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

const WritersManagement = () => {
  // Hardcoded writers data
  const hardcodedWriters = [
    {
      id: "684c721a74e0e1d9989f6f55",
      email: "nduhiu1@example.com",
      password: "$2a$10$k4DEV8qFfWJTqAr6qHjmIeeZiLGO0OxMwBKaMWfySMMGW6wW86rs2",
      roles: ["writer"]
    },
    {
      id: "684c722374e0e1d9989f6f56",
      email: "nduhiu2@example.com",
      password: "$2a$10$8.0yzx6dXZ4iIJO8tD.TRehUiHQwMkFG3juwRHcDiz3WD8EJmnDRy",
      roles: ["writer"]
    },
    {
      id: "684c72ca74e0e1d9989f6f57",
      email: "nduhiu206@example.com",
      password: "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      roles: ["writer"]
    },
    {
      id: "684c72ca74e0e1d9989f6f58",
      email: "writer_alpha@example.com",
      password: "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      roles: ["writer"]
    },
    {
      id: "684c72ca74e0e1d9989f6f59",
      email: "writer_beta@example.com",
      password: "$2a$10$yNN6n5kXwz2WrV9qoYWlfOs3NQ.h7yAZY29QODi7.qHJSFTxDqZaO",
      roles: ["writer"]
    }
  ];

  const writers = hardcodedWriters;
  const isLoading = false;
  const isError = false;
  const error = null;

  // Mock functions for create/delete
  const createWriterMutation = {
    mutate: (writerData) => {
      alert(`Simulating writer creation: ${writerData.email}. (API is hardcoded)`);
      setShowAddWriterDialog(false);
      setNewWriterEmail("");
      setNewWriterPassword("");
    },
    isLoading: false,
  };

  const deleteWriterMutation = {
    mutate: (writerId) => {
      alert(`Simulating writer deletion: ${writerId.slice(-6)}. (API is hardcoded)`);
    },
    isLoading: false,
  };

  const [showAddWriterDialog, setShowAddWriterDialog] = useState(false);
  const [newWriterEmail, setNewWriterEmail] = useState("");
  const [newWriterPassword, setNewWriterPassword] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [writerToDelete, setWriterToDelete] = useState(null);

  const handleCreateWriter = () => {
    if (newWriterEmail && newWriterPassword) {
      createWriterMutation.mutate({ email: newWriterEmail, password: newWriterPassword });
    } else {
      alert("Please enter both email and password for the new writer.");
    }
  };

  const handleDeleteWriter = (writerId) => {
    setWriterToDelete(writerId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteWriter = () => {
    if (writerToDelete) {
      deleteWriterMutation.mutate(writerToDelete);
      setWriterToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDeleteWriter = () => {
    setWriterToDelete(null);
    setShowDeleteConfirm(false);
  };

  if (isLoading) return <div className="text-center py-8">Loading writers...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Writers Management (Hardcoded)</h2>
      <Button onClick={() => setShowAddWriterDialog(true)} className="mb-4 w-full sm:w-auto">Add New Writer (Disabled)</Button>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {writers.map((writer) => (
              <TableRow key={writer.id} className="hover:bg-blue-50">
                <TableCell>{writer.email}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteWriter(writer.id)} disabled className="w-full sm:w-auto text-xs sm:text-sm">
                    Delete (Disabled)
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        isOpen={showAddWriterDialog}
        onClose={() => setShowAddWriterDialog(false)}
        title="Add New Writer"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="writer-email">
            Email
          </label>
          <Input
            id="writer-email"
            type="email"
            placeholder="writer@example.com"
            value={newWriterEmail}
            onChange={(e) => setNewWriterEmail(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="writer-password">
            Password
          </label>
          <Input
            id="writer-password"
            type="password"
            placeholder="********"
            value={newWriterPassword}
            onChange={(e) => setNewWriterPassword(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <Button onClick={handleCreateWriter} disabled className="w-full sm:w-auto">Create Writer (Disabled)</Button>
      </Dialog>
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={cancelDeleteWriter}
        title="Confirm Delete Writer"
      >
        <div className="mb-4">Are you sure you want to delete this writer?</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={cancelDeleteWriter} className="w-full sm:w-auto">Cancel</Button>
          <Button variant="destructive" onClick={confirmDeleteWriter} className="w-full sm:w-auto">Delete</Button>
        </div>
      </Dialog>
    </Card>
  );
};

export default WritersManagement;
