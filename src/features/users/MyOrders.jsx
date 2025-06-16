import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../../components/ui/table";
import Loader from "../../components/ui/Loader";
import { useAuth } from "../auth/AuthProvider";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError("");
    const jwt = localStorage.getItem("jwt_token");
    const roles = user.roles || [];
    let url = `http://localhost:8080/api/admin/orders?page=${currentPage}&page_size=${PAGE_SIZE}`;
    if (roles.includes("super_admin") || roles.includes("admin")) {
      // No filter, show all orders
    } else if (roles.includes("writer")) {
      url = `http://localhost:8080/api/writer/orders/${user.id}?page=${currentPage}&page_size=${PAGE_SIZE}`;
    } else if (roles.length === 1 && roles[0] === "user") {
      url = `http://localhost:8080/api/orders/me?page=${currentPage}&page_size=${PAGE_SIZE}`;
    }
    fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Authorization": jwt ? `Bearer ${jwt}` : ""
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
          setTotal(data.length);
        } else {
          setOrders(data.orders || []);
          setTotal(data.total || (data.orders ? data.orders.length : 0));
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to fetch orders");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.id, user && JSON.stringify(user.roles), currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  if (!user) {
    return <div className="flex justify-center items-center min-h-[40vh]"><Loader /></div>;
  }

  return (
    <div className="m-1 xs:m-2 sm:m-4 p-1 xs:p-2 sm:p-6 max-w-5xl mx-auto">
      <Card className="p-1 xs:p-2 sm:p-6 shadow-lg border-0">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold mb-2 xs:mb-4 text-blue-900">My Orders</h2>
        {/* Status Tabs (for filtering, but only show if user is admin/writer) */}
        {(user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || user?.roles?.includes('writer')) && (
          <Tabs value={"all"} className="mb-4 xs:mb-6">
            <TabsList className="flex w-full overflow-x-auto gap-1 xs:gap-2 bg-white/90 rounded-xl shadow border border-blue-100 p-1 xs:p-2">
              <TabsTrigger value="all" className="capitalize px-3 xs:px-6 py-1 xs:py-2 rounded-lg text-xs xs:text-base font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-blue-50 data-[state=inactive]:text-blue-900 data-[state=inactive]:hover:bg-blue-100" data-state="active">All</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {loading ? (
                <div className="text-center py-8 text-blue-700"><Loader /></div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Writer</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0 ? (
                          orders.map(order => (
                            <TableRow key={order.id} className="hover:bg-blue-50">
                              <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                              </TableCell>
                              <TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                              <TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
                              <TableCell>{/* Actions can go here */}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-xs xs:text-sm sm:text-base">No orders found.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Pagination */}
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 xs:mt-6 gap-2">
                    <nav className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 xs:px-3 py-1 xs:py-2 gap-1" aria-label="Pagination">
                      <Button onClick={handlePrevPage} disabled={currentPage === 1} className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none" aria-label="Previous page">&lt;</Button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`} aria-label={`Page ${i + 1}`}>{i + 1}</Button>
                      ))}
                      <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none" aria-label="Next page">&gt;</Button>
                    </nav>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
        {/* If not admin/writer, just show table */}
        {!(user?.roles?.includes('admin') || user?.roles?.includes('super_admin') || user?.roles?.includes('writer')) && (
          loading ? (
            <Loader />
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No orders found.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Writer</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map(order => (
                      <TableRow key={order.id} className="hover:bg-blue-50">
                        <TableCell className="max-w-[120px] truncate text-xs xs:text-sm sm:text-base">{order.title}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'approved' ? 'bg-green-100 text-green-700' : order.status === 'feedback' ? 'bg-yellow-100 text-yellow-700' : order.status === 'pending_payment' ? 'bg-red-100 text-red-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : order.status === 'awaiting_assignment' ? 'bg-gray-100 text-gray-700' : order.status === 'assigned' ? 'bg-purple-100 text-purple-700' : order.status === 'in_progress' ? 'bg-orange-100 text-orange-700' : order.status === 'submitted_for_review' ? 'bg-cyan-100 text-cyan-700' : order.status === 'completed' ? 'bg-green-200 text-green-900' : 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
                        </TableCell>
                        <TableCell className="text-xs xs:text-sm sm:text-base">{order.writer_id ? order.writer_id.slice(-6) : 'Unassigned'}</TableCell>
                        <TableCell className="text-xs xs:text-sm sm:text-base">${order.price?.toFixed(2)}</TableCell>
                        <TableCell>{/* Actions can go here */}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 xs:mt-6 gap-2">
                <nav className="flex items-center justify-center rounded-full bg-white/80 shadow-sm border border-blue-100 px-2 xs:px-3 py-1 xs:py-2 gap-1" aria-label="Pagination">
                  <Button onClick={handlePrevPage} disabled={currentPage === 1} className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none" aria-label="Previous page">&lt;</Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`rounded-full px-3 py-1 text-xs xs:text-sm sm:text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`} aria-label={`Page ${i + 1}`}>{i + 1}</Button>
                  ))}
                  <Button onClick={handleNextPage} disabled={currentPage === totalPages} className="rounded-full px-2 xs:px-3 py-1 text-xs xs:text-sm sm:text-base font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 border-none shadow-none" aria-label="Next page">&gt;</Button>
                </nav>
              </div>
            </>
          )
        )}
      </Card>
    </div>
  );
};

export default MyOrders;
