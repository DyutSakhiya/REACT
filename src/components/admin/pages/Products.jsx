import React, { useState, useEffect } from "react";
import { Edit, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:4000/api";

const Products = () => {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    category: "",
    imageUrl: "",
    imagePublicId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchProducts = () => {
    if (!user || !user.hotelId) {
      toast.error("Hotel ID not found");
      return;
    }

    fetch(`${API_URL}/get_food_items?hotelId=${user.hotelId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load products"));
  };

  useEffect(() => {
    if (user && user.hotelId) {
      fetchProducts();
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({ ...formData, imageUrl: "", imagePublicId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category } = formData;

    if (!name || !price || !category) {
      toast.error("Please fill all fields");
      return;
    }

    if (!user || !user.hotelId) {
      toast.error("Hotel ID not found");
      return;
    }

    setUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("price", price);
      formDataToSend.append("category", category);
      formDataToSend.append("adminUsername", user.name); 

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      const token = localStorage.getItem('token');
      
      if (isEditing) {
        if (formData.imagePublicId && selectedImage) {
          formDataToSend.append("oldImagePublicId", formData.imagePublicId);
        }

        const response = await fetch(`${API_URL}/products/${formData.id}`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend,
        });

        if (response.ok) {
          toast.success("Product updated!");
          fetchProducts();
          resetForm();
        } else {
          throw new Error("Update failed");
        }
      } else {
        const response = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataToSend,
        });

        if (response.ok) {
          toast.success("Product added!");
          fetchProducts();
          resetForm();
        } else {
          throw new Error("Add failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(isEditing ? "Update failed" : "Add failed");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || "",
      imagePublicId: product.imagePublicId || "",
    });
    setIsEditing(true);
    setImagePreview(product.imageUrl || "");
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    const token = localStorage.getItem('token');
    
    fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Delete failed');
        }
        return res.json();
      })
      .then(() => {
        toast.success("Product deleted!");
        fetchProducts();
      })
      .catch(() => toast.error("Delete failed"));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      category: "",
      imageUrl: "",
      imagePublicId: "",
    });
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview("");
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Please log in to access product management
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Product Management - {user?.hotelId}
      </h2>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full px-3 py-2 rounded border"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price (₹)"
              className="w-full px-3 py-2 rounded border"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <input
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-3 py-2 rounded border"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center block cursor-pointer hover:border-orange-500"
                >
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <span className="text-xs text-gray-500">Click to upload</span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 rounded text-white font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              {uploading
                ? isEditing
                  ? "Updating..."
                  : "Adding..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded text-gray-600 bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">Product List</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600 border-b">
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price (₹)</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">{product.price}</td>
                    <td className="p-3">{product.category}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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