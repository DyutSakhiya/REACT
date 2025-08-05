import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/CartSlice";
import FoodItems from "../components/FoodItems";
import Cart from "../components/cart";
import { FaQrcode, FaPrint } from "react-icons/fa";
import jsPDF from "jspdf";

const TableOrder = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cart);
  
  const [orderId, setOrderId] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [showQR, setShowQR] = useState(true);

  useEffect(() => {
    
    setOrderId(`ORD-${Date.now()}`);
    setOrderTime(new Date().toLocaleString());
  }, []);

  const generateBill = () => {
    const doc = new jsPDF();
    
    
    doc.setFontSize(20);
    doc.text("Flavoro Foods", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text("123 Food Street, Rajkot", 105, 22, null, null, "center");
    doc.text("Gujarat, India - 360005", 105, 28, null, null, "center");
    doc.text(`Phone: +91 9876543210`, 105, 34, null, null, "center");
    
    
    doc.setFontSize(14);
    doc.text(`Order #: ${orderId}`, 14, 45);
    doc.text(`Table #: ${tableNumber}`, 14, 52);
    doc.text(`Date: ${orderTime}`, 14, 59);
    
    
    doc.line(10, 65, 200, 65);
    
    
    doc.setFontSize(12);
    doc.text("Item", 14, 75);
    doc.text("Qty", 100, 75);
    doc.text("Price", 150, 75, null, null, "right");
    
    let yPos = 85;
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty));
    
    cartItems.forEach(item => {
      doc.text(item.name, 14, yPos);
      doc.text(item.qty.toString(), 100, yPos);
      doc.text(`₹${item.price * item.qty}`, 150, yPos, null, null, "right");
      yPos += 8;
    });
    
    
    doc.line(10, yPos + 5, 200, yPos + 5);
    doc.setFontSize(14);
    doc.text(`Total: ₹${total}`, 150, yPos + 15, null, null, "right");
    
    doc.setFontSize(10);
    doc.text("Thank you for dining with us!", 105, 280, null, null, "center");
    
    doc.save(`Flavoro-Bill-${orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Table {tableNumber} Order
            </h1>
            <p className="text-gray-600">Order ID: {orderId}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <FaQrcode /> Show QR
            </button>
            <button 
              onClick={generateBill}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaPrint /> Print Bill
            </button>
          </div>
        </div>

{showQR && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Table {tableNumber} QR Code</h2>
        <button 
          onClick={() => setShowQR(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <QRCodeGenerator tableNumber={tableNumber} showDownload={true} />
      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-1">Instructions:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Download and print this QR code</li>
          <li>Place it visibly on the table</li>
          <li>Customers can scan to order</li>
        </ul>
      </div>
    </div>
  </div>
)}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FoodItems />
          </div>
          <div>
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOrder;