
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Edit, Trash2, Upload, X, Plus, Minus, Home, Users, ShoppingCart, Package, Table, Menu, X as CloseIcon, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import { API_URL } from "../../../helper";

// Integrated Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Table, label: "Tables", path: "/admin/tables" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const hotelName = user?.hotelname || user?.hotelName || "Flavaro Admin";
  
  // Get hotel logo from user data
  const hotelLogo = user?.hotelLogo;
  
  // Function to get logo URL
  const getLogoUrl = () => {
    if (hotelLogo && hotelLogo.data) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Hotel Logo" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <Building2 className="text-orange-600" size={20} />
          )}
          <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
            {hotelName}
          </h2>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg border border-gray-200"
        >
          {isMobileOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r p-4 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64 w-64
      `}>
        {/* Desktop Title - Hidden on mobile */}
        <div className="mb-8 px-4 hidden lg:block">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="text-orange-600" size={24} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {hotelName}
              </h2>
              <p className="text-xs text-gray-500">Hotel Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <Building2 className="text-orange-600" size={20} />
            )}
            <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
              {hotelName}
            </h2>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-gray-200"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

const ProductRowSkeleton = () => {
  return (
    <tr className="border-b animate-pulse">
      <td className="p-3">
        <div className="w-12 h-12 bg-gray-300 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="p-3">
        <div className="h-4 bg-gray-300 rounded w-16"></div>
      </td>
      <td className="p-3">
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
      </td>
      <td className="p-3">
        <div className="h-6 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="p-3">
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );
};

const TableSkeleton = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-600 border-b">
            <th className="p-3">Image</th>
            <th className="p-3">Name</th>
            <th className="p-3">Base Price (₹)</th>
            <th className="p-3">Quantity Options</th>
            <th className="p-3">Category</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FormSkeleton = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-8 animate-pulse">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
        </div>

        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="h-6 bg-gray-300 rounded w-48 mb-3"></div>
          <div className="space-y-2">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-24 bg-gray-300 rounded"></div>
        </div>

        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  );
};

const Products = () => {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [quantityPrices, setQuantityPrices] = useState([
    { quantity: "", price: "" }
  ]);

  const formRef = useRef(null);
  const observer = useRef();

  const fetchProducts = useCallback(async (pageNum = 1, append = false) => {
    if (!user || !user.hotelId) {
      toast.error("Hotel ID not found");
      return;
    }

    try {
      if (pageNum === 1) {
        setInitialLoad(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetch(
        `${API_URL}/get_food_items?hotel_id=${user.hotelId}&page=${pageNum}&limit=15`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
      }

      setHasMore(data.length >= 15);

      if (pageNum === 1) {
        setInitialLoad(false);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      toast.error("Failed to load products");
    } finally {
      setLoadingMore(false);
    }
  }, [user]);

  const fetchCategories = () => {
    if (!user || !user.hotelId) return;

    fetch(`${API_URL}/categories/${user.hotelId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => {
        if (data.success) setCategories(data.categories || []);
      })
      .catch(() => toast.error("Failed to load categories"));
  };

  useEffect(() => {
    if (user && user.hotelId) {
      fetchProducts(1, false);
      fetchCategories();
    }
  }, [user, fetchProducts]);

  const lastProductElementRef = useCallback(node => {
    if (loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, true);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, page, fetchProducts]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "add_new") {
      setShowNewCategoryInput(true);
      setFormData({ ...formData, category: "" });
    } else {
      setFormData({ ...formData, category: value });
      setShowNewCategoryInput(false);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    setFormData({ ...formData, category: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setFormData({ ...formData, imageUrl: "", imagePublicId: "" });
  };

  const handleQuantityPriceChange = (index, field, value) => {
    const updatedQuantityPrices = [...quantityPrices];
    updatedQuantityPrices[index][field] = value;
    setQuantityPrices(updatedQuantityPrices);
  };

  const addQuantityPriceField = () => {
    setQuantityPrices([...quantityPrices, { quantity: "", price: "" }]);
  };

  const removeQuantityPriceField = (index) => {
    if (quantityPrices.length > 1) {
      const updatedQuantityPrices = quantityPrices.filter((_, i) => i !== index);
      setQuantityPrices(updatedQuantityPrices);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, category } = formData;

    if (!name || !price || !category) {
      toast.error("Please fill all fields");
      return;
    }

    const validQuantityPrices = quantityPrices.filter(qp => {
      const hasQuantity = qp.quantity && String(qp.quantity).trim() !== "";
      const hasPrice = qp.price !== "" && qp.price !== null && qp.price !== undefined;
      return hasQuantity && hasPrice;
    });

    if (!user || !user.hotelId) {
      toast.error("Hotel ID not found");
      return;
    }

    setUploading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("name", name);
    formDataToSend.append("price", price);
    formDataToSend.append("category", category);
    formDataToSend.append("adminUsername", user.name);

    if (validQuantityPrices.length > 0) {

      const processedQuantityPrices = validQuantityPrices.map(qp => ({
        quantity: qp.quantity,
        price: Number(qp.price)
      }));
      formDataToSend.append("quantityPrices", JSON.stringify(processedQuantityPrices));
    }

    if (selectedImage) formDataToSend.append("image", selectedImage);
    const token = localStorage.getItem("token");

    try {
      let response;
      if (isEditing) {
        if (formData.imagePublicId && selectedImage) {
          formDataToSend.append("oldImagePublicId", formData.imagePublicId);
        }

        response = await fetch(`${API_URL}/products/${formData.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_URL}/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || (isEditing ? "Update failed" : "Add failed"));
      }

      if (result.success) {
        toast.success(isEditing ? "Product updated!" : "Product added!");

        setPage(1);
        fetchProducts(1, false);
        fetchCategories();
        resetForm();
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || (isEditing ? "Update failed" : "Add failed"));
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

    if (product.quantityPrices && Array.isArray(product.quantityPrices)) {
      const formattedQuantityPrices = product.quantityPrices.map(qp => ({
        quantity: String(qp.quantity),
        price: String(qp.price)
      }));
      setQuantityPrices(formattedQuantityPrices);
    } else {
      setQuantityPrices([{ quantity: "", price: "" }]);
    }

    setIsEditing(true);
    setImagePreview(product.imageUrl || "");
    setShowNewCategoryInput(false);
    setSelectedImage(null);

    // Scroll to the form at the top of the page
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed");
      }

      if (result.success) {
        toast.success("Product deleted!");
        setPage(1);
        fetchProducts(1, false);
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Delete failed");
    }
  };

  const handleDeleteQuantityPrice = async (productId, quantityToDelete) => {
    if (!window.confirm(`Delete the quantity option "${quantityToDelete}"?`)) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/products/${productId}/quantity-price`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: quantityToDelete }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete quantity option");
      }

      if (result.success) {
        toast.success("Quantity option deleted!");
        fetchProducts(page, false);
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting quantity option:", error);
      toast.error(error.message || "Failed to delete quantity option");
    }
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
    setQuantityPrices([{ quantity: "", price: "" }]);
    setIsEditing(false);
    setSelectedImage(null);
    setImagePreview("");
    setShowNewCategoryInput(false);
    setNewCategory("");
  };

  if (loading) {
    return (
      <>
        <div className="lg:hidden">
          <Sidebar />
        </div>
        <div className="max-w-6xl mx-auto p-4 mt-16 lg:mt-0">
          <FormSkeleton />
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
            <TableSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (!user)
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Please log in to access product management
        </h2>
      </div>
    );

  return (
    <>
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 max-w-6xl mx-auto p-4 mt-16 lg:mt-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Management
          </h2>

          {initialLoad ? (
            <FormSkeleton />
          ) : (
            <div ref={formRef} className="bg-white p-4 rounded-lg shadow mb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Product Name"
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Base Price (₹)"
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity-Price Options (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addQuantityPriceField}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      <Plus size={16} />
                      Add Option
                    </button>
                  </div>

                  {quantityPrices.map((qp, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        value={qp.quantity}
                        onChange={(e) => handleQuantityPriceChange(index, "quantity", e.target.value)}
                        placeholder="Quantity (e.g., 250ml, 500g, Large)"
                        className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                      />
                      <input
                        type="number"
                        value={qp.price}
                        onChange={(e) => handleQuantityPriceChange(index, "price", e.target.value)}
                        placeholder="Price (₹)"
                        className="w-32 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        min="0"
                        step="0.01"
                      />
                      {quantityPrices.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeQuantityPriceField(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-2">
                    Add different quantity options with their prices (e.g., 250ml - ₹50, 500ml - ₹90). This is optional.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    {!showNewCategoryInput ? (
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                        <option value="add_new">+ Add New Category</option>
                      </select>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={handleNewCategoryChange}
                          placeholder="Enter new category"
                          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowNewCategoryInput(false);
                            setFormData({ ...formData, category: "" });
                            setNewCategory("");
                          }}
                          className="px-3 py-2 rounded text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image (Optional)
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center block cursor-pointer hover:border-orange-500 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                        <span className="text-xs text-gray-500">
                          Click to upload (optional)
                        </span>
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

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 rounded text-white font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                      className="px-6 py-2 rounded text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Product List</h3>

            {initialLoad ? (
              <TableSkeleton />
            ) : products.length === 0 ? (
              <p className="text-gray-500">No products available.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-600 border-b">
                        <th className="p-3">Image</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Base Price (₹)</th>
                        <th className="p-3">Quantity Options</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => {
                        if (index === products.length - 1) {
                          return (
                            <tr
                              ref={lastProductElementRef}
                              key={product._id}
                              className="border-b hover:bg-gray-50"
                            >
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
                              <td className="p-3 font-medium">{product.name}</td>
                              <td className="p-3">₹{product.price}</td>
                              <td className="p-3">
                                {product.quantityPrices && product.quantityPrices.length > 0 ? (
                                  <div className="space-y-1">
                                    {product.quantityPrices.map((qp, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <span className="text-xs text-gray-600">
                                          {qp.quantity}: ₹{qp.price}
                                        </span>
                                        <button
                                          onClick={() => handleDeleteQuantityPrice(product._id, qp.quantity)}
                                          className="p-1 text-red-500 hover:bg-red-50 rounded text-xs transition-colors"
                                          title="Delete this quantity option"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">No options</span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {product.category}
                                </span>
                              </td>
                              <td className="p-3 flex gap-2">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(product._id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        return (
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
                            <td className="p-3 font-medium">{product.name}</td>
                            <td className="p-3">₹{product.price}</td>
                            <td className="p-3">
                              {product.quantityPrices && product.quantityPrices.length > 0 ? (
                                <div className="space-y-1">
                                  {product.quantityPrices.map((qp, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <span className="text-xs text-gray-600">
                                        {qp.quantity}: ₹{qp.price}
                                      </span>
                                   
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">No options</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-3 flex gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {loadingMore && (
                  <div className="mt-4">
                    <TableSkeleton />
                  </div>
                )}

                {!hasMore && products.length > 0 && (
                  <div className="text-center py-6">
                    <p className="text-gray-500">All products loaded</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
