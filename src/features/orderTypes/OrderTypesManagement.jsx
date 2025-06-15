import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

const OrderTypesManagement = () => {
  // Hardcoded order types
  const hardcodedOrderTypes = [
    {
      id: "684c3c2c670dd03bd9e6cf03",
      name: "Science and Engineering",
      description: "STEM projects",
      created_by: "684c3b4bca82dae8451e1c5f",
      created_at: "2025-06-13T14:56:44.471Z",
      updated_at: "2025-06-13T14:56:44.471Z"
    },
    {
      id: "684c3c2c670dd03bd9e6cf04",
      name: "Humanities",
      description: "Literature, History, Philosophy, etc.",
      created_by: "684c3b4bca82dae8451e1c5f",
      created_at: "2025-06-13T15:00:00.000Z",
      updated_at: "2025-06-13T15:00:00.000Z"
    },
    {
      id: "684c3c2c670dd03bd9e6cf05",
      name: "Business and Economics",
      description: "Marketing, Finance, Accounting, Micro/Macro Economics",
      created_by: "684c3b4bca82dae8451e1c5f",
      created_at: "2025-06-13T15:05:00.000Z",
      updated_at: "2025-06-13T15:05:00.000Z"
    },
    {
      id: "684c3c2c670dd03bd9e6cf06",
      name: "Medical and Health Sciences",
      description: "Nursing, Medicine, Public Health, Pharmacy",
      created_by: "684c3b4bca82dae8451e1c5f",
      created_at: "2025-06-13T15:10:00.000Z",
      updated_at: "2025-06-13T15:10:00.000Z"
    }
  ];

  const orderTypes = hardcodedOrderTypes;
  const isLoading = false;
  const isError = false;
  const error = null;

  // State and handlers for adding/deleting are no longer relevant for hardcoded data
  const [showAddOrderTypeDialog, setShowAddOrderTypeDialog] = useState(false);
  const [newOrderTypeName, setNewOrderTypeName] = useState("");
  const [newOrderTypeDescription, setNewOrderTypeDescription] = useState("");

  // Mock functions for create/delete to prevent errors if accidentally called
  const handleCreateOrderType = () => {
    alert("Adding new order types is disabled in hardcoded mode.");
    setShowAddOrderTypeDialog(false);
    setNewOrderTypeName("");
    setNewOrderTypeDescription("");
  };

  const handleDeleteOrderType = (orderTypeId) => {
    alert("Deleting order types is disabled in hardcoded mode.");
  };

  if (isLoading) return <div className="text-center py-8">Loading order types...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <Card className="m-2 sm:m-4 p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-blue-900">Order Types Management (Hardcoded)</h2>
      <div className="overflow-x-auto rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderTypes.map((type) => (
              <TableRow key={type.id} className="hover:bg-blue-50">
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteOrderType(type.id)} disabled className="w-full sm:w-auto text-xs sm:text-sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog
        isOpen={showAddOrderTypeDialog}
        onClose={() => setShowAddOrderTypeDialog(false)}
        title="Add New Order Type"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order-type-name">
            Name
          </label>
          <Input
            id="order-type-name"
            placeholder="Essay"
            value={newOrderTypeName}
            onChange={(e) => setNewOrderTypeName(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order-type-description">
            Description
          </label>
          <Input
            id="order-type-description"
            placeholder="Description of the order type"
            value={newOrderTypeDescription}
            onChange={(e) => setNewOrderTypeDescription(e.target.value)}
            required
            className="bg-white"
          />
        </div>
        <Button onClick={handleCreateOrderType} disabled className="w-full sm:w-auto">Create Order Type (Disabled)</Button>
      </Dialog>
    </Card>
  );
};

export default OrderTypesManagement;
