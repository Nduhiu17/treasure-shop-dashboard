import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";

const PAGE_SIZE = 10;

const OrderTypesManagement = () => {
  // Hardcoded order types (add more for pagination demo)
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
    },
    // Add more mock order types for pagination demo if needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const totalOrderTypes = hardcodedOrderTypes.length;
  const totalPages = Math.max(1, Math.ceil(totalOrderTypes / PAGE_SIZE));
  const paginatedOrderTypes = hardcodedOrderTypes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (isLoading) return <div className="text-center py-8">Loading order types...</div>;
  if (isError) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <Card className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 shadow-lg border-0">
      <h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">Order Types Management (Hardcoded)</h2>
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
            {paginatedOrderTypes.map((type) => (
              <TableRow key={type.id} className="hover:bg-blue-50">
                <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{type.name}</TableCell>
                <TableCell className="text-xs xs:text-sm sm:text-base">{type.description}</TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteOrderType(type.id)} disabled className="w-full sm:w-auto text-xs xs:text-sm sm:text-base">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedOrderTypes.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-xs xs:text-sm sm:text-base">No order types found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 xs:mt-6 gap-2">
        <nav
          className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 xs:px-3 py-1 xs:py-2 gap-1"
          aria-label="Pagination"
        >
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Previous page"
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-semibold mx-0.5 border-none shadow-none transition-colors
                ${currentPage === i + 1
                  ? 'bg-blue-700 text-white ring-2 ring-blue-400'
                  : 'bg-transparent text-blue-700 hover:bg-blue-100'}
              `}
              aria-current={currentPage === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none"
            aria-label="Next page"
          >
            &gt;
          </Button>
        </nav>
        <span className="text-xs xs:text-sm sm:text-base text-gray-600">Page {currentPage} of {totalPages}</span>
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
