import React, { useEffect, useState } from "react";
import Loader from '../../components/ui/Loader';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetches full order details by orderId and renders children with the full order object.
 * Usage: <OrderDetailsFetcher orderId={id}>{order => <OrderExpandableTabs order={order} />}</OrderDetailsFetcher>
 */
const OrderDetailsFetcher = ({ orderId, children }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    const jwt = localStorage.getItem('jwt_token');
    fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': jwt ? `Bearer ${jwt}` : ''
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch order details');
        return res.json();
      })
      .then(data => setOrder(data.order || null))
      .catch(err => setError(err.message || 'Failed to fetch order details'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="py-4"><Loader text="Loading order details..." /></div>;
  if (error) return <div className="py-4 text-red-600">{error}</div>;
  if (!order) return <div className="py-4 text-gray-500">Order not found.</div>;
  return children(order);
};

export default OrderDetailsFetcher;
