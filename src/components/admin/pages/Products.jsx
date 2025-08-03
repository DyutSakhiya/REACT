import React, { useState } from "react";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Margherita Pizza", price: 299, category: "Pizza", stock: 50 },
    { id: 2, name: "Pasta Alfredo", price: 249, category: "Pasta", stock: 30 },
    { id: 3, name: "Caesar Salad", price: 199, category: "Salad", stock: 20 },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    stock: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, category, stock } = formData;

    if (!name || !price || !category || !stock) {
      toast.error("Please fill all fields");
      return;
    }
    if (isNaN(price) || price <= 0) {
      toast.error("Price must be a positive number");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      toast.error("Stock must be a non-negative number");
      return;
    }

    if (isEditing) {
      setProducts(
        products.map((product) =>
          product.id === formData.id ? { ...formData, price: Number(price), stock: Number(stock) } : product
        )
      );
      toast.success("Product updated successfully!");
    } else {
      const newProduct = {
        id: products.length + 1,
        name,
        price: Number(price),
        category,
        stock: Number(stock),
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully!");
    }

    setFormData({ id: null, name: "", price: "", category: "", stock: "" });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setFormData(product);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.success("Product deleted successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Product Management</h2>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4">{isEditing ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
            />
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
            />
            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-orange-400"
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
                onClick={() => {
                  setFormData({ id: null, name: "", price: "", category: "", stock: "" });
                  setIsEditing(false);
                }}
                className="py-3 px-6 rounded-lg text-gray-600 font-semibold bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

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
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">{product.price}</td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-full"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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