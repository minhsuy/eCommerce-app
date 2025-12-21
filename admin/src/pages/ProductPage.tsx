import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ImageIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useState, type Key } from "react";
import { productApi } from "../lib/api/admin";
import { toast } from "react-toastify";
import { getStockStatusBadge } from "../utils/utils";
import Swal from "sweetalert2";
type ProductData = {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
};
const ProductPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(
    null
  );
  const [initialValues, setInitialValues] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });
  const setField = ({
    name,
    value,
  }: {
    name: keyof ProductData;
    value: string;
  }) => {
    setInitialValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });
  const addProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }
    setImages(files);
    setImagesPreview(files.map((file) => URL.createObjectURL(file)));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", initialValues.name);
    formData.append("description", initialValues.description);
    formData.append("price", initialValues.price.toString());
    formData.append("stock", initialValues.stock.toString());
    formData.append("category", initialValues.category);
    images.forEach((image) => formData.append("images", image));
    if (editingProduct) {
      await updateProductMutation.mutateAsync({
        id: editingProduct._id as string,
        formData,
      });
      toast.success("Product updated successfully");
    } else {
      await addProductMutation.mutateAsync(formData);
      toast.success("Product added successfully");
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setInitialValues({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    });
    setImages([]);
    setImagesPreview([]);
  };
  const handleRemoveImage = (image: string, index: Key) => {
    setImagesPreview((prev) => prev.filter((img) => img !== image));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleEditProduct = (product: ProductData) => {
    setEditingProduct(product);
    setInitialValues({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setImagesPreview(product.images ?? []);
  };
  const handleDeleteProduct = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteProductMutation.mutateAsync({ id });
        toast.success("Product deleted successfully");
      }
    });
  };
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">
            Manage your product inventory
          </p>
        </div>
        <button
          className="btn btn-primary gap-2"
          onClick={() => setShowModal(!showModal)}
        >
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>
      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 gap-4">
        {products &&
          products.map((product: ProductData) => {
            const status = getStockStatusBadge(product.stock);

            return (
              <div key={product._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-6">
                    <div className="avatar">
                      <div className="w-20 rounded-xl">
                        <img
                          src={product.images && product.images[0]}
                          alt={product.name}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="card-title">{product.name}</h3>
                          <p className="text-base-content/70 text-sm">
                            {product.category}
                          </p>
                        </div>
                        <div className={`badge ${status.class}`}>
                          {status.text}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 mt-4">
                        <div>
                          <p className="text-xs text-base-content/70">Price</p>
                          <p className="font-bold text-lg">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Stock</p>
                          <p className="font-bold text-lg">
                            {product.stock} units
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => handleEditProduct(product)}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="btn btn-square btn-ghost text-error"
                        onClick={() =>
                          handleDeleteProduct(product._id as string)
                        }
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* ADD/EDIT PRODUCT MODAL */}

      <input
        type="checkbox"
        className="modal-toggle"
        checked={showModal || editingProduct !== null}
      />
      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button
              className="btn btn-sm btn-circle btn-ghost"
              onClick={closeModal}
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Product Name</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered"
                  name="name"
                  value={initialValues.name}
                  onChange={(e) =>
                    setField({ name: "name", value: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select
                  className="select select-bordered"
                  required
                  name="category"
                  value={initialValues.category}
                  onChange={(e) =>
                    setField({ name: "category", value: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered"
                  required
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  name="price"
                  value={initialValues.price}
                  onChange={(e) =>
                    setField({ name: "price", value: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span>Stock</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered"
                  required
                  value={initialValues.stock}
                  onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                  onChange={(e) =>
                    setField({ name: "stock", value: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span>Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter product description"
                required
                name="description"
                value={initialValues.description}
                onChange={(e) =>
                  setField({ name: "description", value: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">
                  Max 3 images
                </span>
              </label>

              <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="file-input file-input-bordered file-input-primary w-full"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {imagesPreview.length > 0 && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Preview
                  </span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {imagesPreview.map((image, index) => (
                    <div className="relative inline-block">
                      <img
                        src={image}
                        alt={`preview-${index}`}
                        className="w-20 h-20 object-cover rounded"
                      />

                      <button
                        type="button"
                        className="absolute -top-2 -right-2 btn btn-xs btn-error btn-circle"
                        aria-label="Remove image"
                        onClick={() => handleRemoveImage(image, index)}
                      >
                        <Trash2Icon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-action">
              <button type="button" className="btn">
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={addProductMutation.isPending}
              >
                {addProductMutation.isPending ||
                updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <span>
                    {editingProduct ? "Update Product" : "Add Product"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
