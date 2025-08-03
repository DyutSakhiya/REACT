import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

const Success = () => {
  const [loading, setLoading] = useState(true);
  const cartItems = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const [orderId] = useState(`ORD-${Date.now()}`);
  const [orderTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      generateReceipt();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const generateReceipt = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Flavoro Foods", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text("123 Food Street, Rajkot", 105, 22, null, null, "center");
    doc.text("Gujarat, India - 360005", 105, 28, null, null, "center");
    doc.text(`Phone: +91 9876543210`, 105, 34, null, null, "center");
    
    doc.setFontSize(14);
    doc.text(`Order #: ${orderId}`, 14, 45);
    doc.text(`Date: ${orderTime}`, 14, 52);
    
    doc.line(10, 60, 200, 60);
    
    doc.setFontSize(12);
    doc.text("Item", 14, 70);
    doc.text("Qty", 100, 70);
    doc.text("Price", 150, 70, null, null, "right");
    
    let yPos = 80;
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
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
    doc.text("Thank you for your order!", 105, 280, null, null, "center");
    
    const pdfOutput = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {loading ? (
        <div className="text-center">
          <PropagateLoader color="#36d7b7" />
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      ) : (
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-semibold mb-2">Order Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your order #{orderId} has been placed successfully.
          </p>
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="font-medium">Order Summary</p>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mt-2">
                <span>{item.name} × {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}
            <div className="flex justify-between mt-4 pt-2 border-t border-gray-300 font-bold">
              <span>Total</span>
              <span>
                ₹{cartItems.reduce((total, item) => total + item.price * item.qty, 0)}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Success;