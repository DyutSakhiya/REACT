import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:4000/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load products from MongoDB
  const fetchProducts = () => {
    fetch(`${API_URL}/get_food_items`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load products"));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, category } = formData;

    if (!name || !price || !category) {
      toast.error("Please fill all fields");
      return;
    }

    if (isEditing) {
      // Update product
      fetch(`${API_URL}/products/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), category }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Product updated!");
          fetchProducts();
          resetForm();
        })
        .catch(() => toast.error("Update failed"));
    } else {
      // Add new product
      fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), category }),
      })
        .then((res) => res.json())
        .then(() => {
          toast.success("Product added!");
          fetchProducts();
          resetForm();
        })
        .catch(() => toast.error("Add failed"));
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    fetch(`${API_URL}/products/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        toast.success("Product deleted!");
        fetchProducts();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const resetForm = () => {
    setFormData({ id: null, name: "", price: "", category: "" });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
        Product Management
      </h2>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-4 py-3 rounded-lg border"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="w-full px-4 py-3 rounded-lg border"
            />
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-3 rounded-lg border"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="py-3 px-6 rounded-lg text-white font-semibold bg-orange-500 hover:bg-orange-600"
            >
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="py-3 px-6 rounded-lg text-gray-600 font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="p-4">Name</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
