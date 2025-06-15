import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";

const UserProfile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    const jwt = localStorage.getItem("jwt_token");
    const roles = user.roles || [];
    // Only run this effect when user or user.roles changes
    // Role-based filtering
    let url = `http://localhost:8080/api/admin/orders`;
    if (roles.includes("super_admin") || roles.includes("admin")) {
      // No filter, show all orders
    } else if (roles.includes("writer")) {
     url = `http://localhost:8080/api/writer/orders/${user.id}`;
    //   url += `?writer_id=${String(user.id)}`;
    } else if (roles.length === 1 && roles[0] === "user") {
      url = `http://localhost:8080/api/orders/me`;
    }
    fetch(url,
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt ? `Bearer ${jwt}` : ""
        }
      }
    )
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.id, user && JSON.stringify(user.roles)]);

  if (!user) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Loader /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="p-6 mb-8 shadow-lg border-0">
        <h2 className="text-xl font-bold text-blue-900 mb-4">User Profile</h2>
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Username:</span>
            <span className="text-blue-900">{user?.username}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Email:</span>
            <span className="text-blue-900">{user?.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Password:</span>
            <span className="text-blue-900">********</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <span className="font-semibold text-blue-700 w-32">Role:</span>
            <span className="text-blue-900 capitalize">{user?.role}</span>
          </div>
        </div>
      </Card>
      <Card className="p-6 shadow-lg border-0">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Orders</h3>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No orders found.</div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Writer</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} className="hover:bg-blue-50">
                    <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
                    <TableCell className="text-xs xs:text-sm sm:text-base">{order.status}</TableCell>
                    <TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                    <TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;
