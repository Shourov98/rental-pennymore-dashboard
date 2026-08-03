"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";

interface MovingDiscountCategory {
  _id: string;
  title: string;
  slug: string;
  order: number;
  isActive: boolean;
}

interface MovingDiscountItem {
  _id: string;
  categoryId: string;
  companyName: string;
  discount: string;
  description: string;
  link: string;
  order: number;
  isActive: boolean;
}

type ItemFormState = {
  id?: string;
  companyName: string;
  discount: string;
  description: string;
  link: string;
};

const emptyItemForm: ItemFormState = {
  companyName: "",
  discount: "",
  description: "",
  link: "",
};

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function MovingDiscountsPage() {
  const [categories, setCategories] = useState<MovingDiscountCategory[]>([]);
  const [items, setItems] = useState<MovingDiscountItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Category form
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryTitle, setEditingCategoryTitle] = useState("");

  // Item form
  const [itemFormVisible, setItemFormVisible] = useState(false);
  const [itemForm, setItemForm] = useState<ItemFormState>(emptyItemForm);

  // Confirm deletion
  const [confirmDelete, setConfirmDelete] = useState<
    | { kind: "category"; id: string; title: string }
    | { kind: "item"; id: string; label: string }
    | null
  >(null);

  // ───────── helpers ─────────

  const flashError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  const flashSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  const extractErrorMessage = (err: unknown, fallback: string) => {
    if (
      err &&
      typeof err === "object" &&
      "response" in err &&
      err.response &&
      typeof err.response === "object" &&
      "data" in err.response
    ) {
      const data = (err.response as { data?: { message?: string } }).data;
      if (data?.message) return data.message;
    }
    if (err instanceof Error) return err.message;
    return fallback;
  };

  // ───────── loaders ─────────

  const fetchCategories = useCallback(async () => {
    try {
      setStatus("loading");
      setError(null);

      const response = await apiClient.get<{
        success: boolean;
        data: { categories?: MovingDiscountCategory[] };
      }>("/moving-discounts/admin/categories");

      const list = Array.isArray(response.data.data?.categories)
        ? response.data.data.categories
        : [];
      setCategories(list);
      setSelectedCategoryId((current) => {
        if (current && list.some((c) => c._id === current)) return current;
        return list.length > 0 ? list[0]._id : null;
      });
      setStatus("idle");
    } catch (err) {
      setStatus("failed");
      flashError(
        extractErrorMessage(err, "Failed to load moving discount categories."),
      );
    }
  }, []);

  const fetchItems = useCallback(async (categoryId: string) => {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: MovingDiscountItem[];
      }>(`/moving-discounts/admin/items?categoryId=${encodeURIComponent(categoryId)}`);

      const list = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setItems(list);
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to load items."));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchCategories();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchCategories]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([]);
      return;
    }
    const timer = setTimeout(() => {
      void fetchItems(selectedCategoryId);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchItems, selectedCategoryId]);

  // ───────── category actions ─────────

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newCategoryTitle.trim();
    if (!title) return;

    try {
      setMutating(true);
      setError(null);

      await apiClient.post("/moving-discounts/admin/categories", { title });

      setNewCategoryTitle("");
      flashSuccess("Category created.");
      await fetchCategories();
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to create category."));
    } finally {
      setMutating(false);
    }
  };

  const handleStartEditCategory = (category: MovingDiscountCategory) => {
    setEditingCategoryId(category._id);
    setEditingCategoryTitle(category.title);
  };

  const handleCancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryTitle("");
  };

  const handleSaveCategoryTitle = async (categoryId: string) => {
    const title = editingCategoryTitle.trim();
    if (!title) return;

    try {
      setMutating(true);
      setError(null);

      await apiClient.patch(
        `/moving-discounts/admin/categories/${categoryId}`,
        { title },
      );

      flashSuccess("Category renamed.");
      setEditingCategoryId(null);
      setEditingCategoryTitle("");
      await fetchCategories();
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to rename category."));
    } finally {
      setMutating(false);
    }
  };

  const handleMoveCategory = async (index: number, direction: -1 | 1) => {
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= categories.length) return;

    const nextOrder = [...categories];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(swapWith, 0, moved);
    setCategories(nextOrder);

    try {
      setMutating(true);
      await apiClient.post("/moving-discounts/admin/categories/reorder", {
        orderedIds: nextOrder.map((c) => c._id),
      });
      flashSuccess("Categories reordered.");
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to reorder categories."));
      await fetchCategories();
    } finally {
      setMutating(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!confirmDelete || confirmDelete.kind !== "category") return;
    const id = confirmDelete.id;
    try {
      setMutating(true);
      setError(null);

      await apiClient.delete(`/moving-discounts/admin/categories/${id}`);

      flashSuccess("Category deleted.");
      setConfirmDelete(null);
      if (selectedCategoryId === id) setSelectedCategoryId(null);
      await fetchCategories();
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to delete category."));
    } finally {
      setMutating(false);
    }
  };

  // ───────── item actions ─────────

  const handleStartCreateItem = () => {
    if (!selectedCategoryId) return;
    setItemForm({ ...emptyItemForm });
    setItemFormVisible(true);
  };

  const handleStartEditItem = (item: MovingDiscountItem) => {
    setItemForm({
      id: item._id,
      companyName: item.companyName,
      discount: item.discount,
      description: item.description,
      link: item.link,
    });
    setItemFormVisible(true);
  };

  const handleCancelItemForm = () => {
    setItemFormVisible(false);
    setItemForm({ ...emptyItemForm });
  };

  const handleSubmitItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    const companyName = itemForm.companyName.trim();
    const discount = itemForm.discount.trim();
    const description = itemForm.description.trim();
    const link = itemForm.link.trim();

    if (!companyName || !discount || !description || !link) {
      flashError("All item fields are required.");
      return;
    }
    if (!isValidUrl(link)) {
      flashError("Link must be a valid http(s) URL.");
      return;
    }

    const payload = { companyName, discount, description, link };

    try {
      setMutating(true);
      setError(null);

      if (itemForm.id) {
        await apiClient.patch(
          `/moving-discounts/admin/items/${itemForm.id}`,
          payload,
        );
        flashSuccess("Item updated.");
      } else {
        await apiClient.post("/moving-discounts/admin/items", {
          ...payload,
          categoryId: selectedCategoryId,
        });
        flashSuccess("Item created.");
      }

      setItemFormVisible(false);
      setItemForm({ ...emptyItemForm });
      await fetchItems(selectedCategoryId);
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to save item."));
    } finally {
      setMutating(false);
    }
  };

  const handleMoveItem = async (index: number, direction: -1 | 1) => {
    if (!selectedCategoryId) return;
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= items.length) return;

    const nextOrder = [...items];
    const [moved] = nextOrder.splice(index, 1);
    nextOrder.splice(swapWith, 0, moved);
    setItems(nextOrder);

    try {
      setMutating(true);
      await apiClient.post("/moving-discounts/admin/items/reorder", {
        categoryId: selectedCategoryId,
        orderedIds: nextOrder.map((i) => i._id),
      });
      flashSuccess("Items reordered.");
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to reorder items."));
      await fetchItems(selectedCategoryId);
    } finally {
      setMutating(false);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (!confirmDelete || confirmDelete.kind !== "item") return;
    const id = confirmDelete.id;
    try {
      setMutating(true);
      setError(null);

      await apiClient.delete(`/moving-discounts/admin/items/${id}`);

      flashSuccess("Item deleted.");
      setConfirmDelete(null);
      if (selectedCategoryId) await fetchItems(selectedCategoryId);
    } catch (err) {
      flashError(extractErrorMessage(err, "Failed to delete item."));
    } finally {
      setMutating(false);
    }
  };

  // ───────── render ─────────

  const isBusy = status === "loading" || mutating;
  const selectedCategory = categories.find(
    (c) => c._id === selectedCategoryId,
  );

  return (
    <section className="w-full min-h-screen bg-[#F8F9FB] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm px-6 py-4 mb-6">
        <h1 className="text-2xl font-semibold text-[#0A093D]">
          Moving Discounts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage the partner discount categories and items that renters see on
          the Moving Discounts page.
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ===== Categories panel ===== */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 self-start">
          <h2 className="text-base font-semibold text-gray-800">Categories</h2>

          <form onSubmit={handleCreateCategory} className="flex flex-col gap-2">
            <input
              type="text"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              placeholder="New category title"
              maxLength={200}
              disabled={isBusy}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isBusy || !newCategoryTitle.trim()}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-3 py-2 transition"
            >
              <Plus size={16} />
              Add category
            </button>
          </form>

          {status === "loading" ? (
            <p className="text-sm text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500">No categories yet.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category, index) => {
                const isSelected = selectedCategoryId === category._id;
                const isEditing = editingCategoryId === category._id;
                return (
                  <div
                    key={category._id}
                    className={`border rounded-xl p-3 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editingCategoryTitle}
                          onChange={(e) =>
                            setEditingCategoryTitle(e.target.value)
                          }
                          maxLength={200}
                          disabled={isBusy}
                          className="w-full border border-gray-200 bg-white rounded-lg px-2 py-1 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveCategoryTitle(category._id)
                            }
                            disabled={
                              isBusy || !editingCategoryTitle.trim()
                            }
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-semibold rounded px-2 py-1"
                          >
                            <Save size={12} />
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditCategory}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded px-2 py-1"
                          >
                            <X size={12} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryId(category._id)}
                          className="text-left flex-1 min-w-0"
                          disabled={isBusy}
                        >
                          <p className="font-semibold text-sm text-gray-900 truncate">
                            {category.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            slug: {category.slug}
                          </p>
                        </button>
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, -1)}
                            disabled={isBusy || index === 0}
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                            aria-label="Move category up"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, 1)}
                            disabled={
                              isBusy || index === categories.length - 1
                            }
                            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                            aria-label="Move category down"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {!isEditing ? (
                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(category)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          <Edit size={12} />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmDelete({
                              kind: "category",
                              id: category._id,
                              title: category.title,
                            })
                          }
                          disabled={isBusy}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== Items panel ===== */}
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-gray-800">
              {selectedCategory
                ? `Items in "${selectedCategory.title}"`
                : "Items"}
            </h2>
            <button
              type="button"
              onClick={handleStartCreateItem}
              disabled={isBusy || !selectedCategoryId}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-3 py-2 transition"
            >
              <Plus size={16} />
              Add item
            </button>
          </div>

          {!selectedCategoryId ? (
            <p className="text-sm text-gray-500">
              Select a category to manage its items.
            </p>
          ) : items.length === 0 && !itemFormVisible ? (
            <p className="text-sm text-gray-500">
              No items in this category yet.
            </p>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  className="border border-gray-200 bg-gray-50 rounded-xl p-3 flex gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveItem(index, -1)}
                      disabled={isBusy || index === 0}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      aria-label="Move item up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveItem(index, 1)}
                      disabled={isBusy || index === items.length - 1}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                      aria-label="Move item down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {item.companyName}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Discount:</span>{" "}
                      {item.discount}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 inline-block truncate max-w-full"
                    >
                      {item.link}
                    </a>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleStartEditItem(item)}
                      disabled={isBusy}
                      className="p-2 bg-white hover:bg-gray-100 rounded-full disabled:opacity-50"
                      aria-label="Edit item"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmDelete({
                          kind: "item",
                          id: item._id,
                          label: item.companyName,
                        })
                      }
                      disabled={isBusy}
                      className="p-2 bg-white hover:bg-red-100 rounded-full disabled:opacity-50"
                      aria-label="Delete item"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {itemFormVisible ? (
            <form
              onSubmit={handleSubmitItem}
              className="border border-blue-200 bg-blue-50 rounded-xl p-4 space-y-3"
            >
              <h3 className="text-sm font-semibold text-gray-800">
                {itemForm.id ? "Edit item" : "New item"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-xs text-gray-700 flex flex-col gap-1">
                  Company name
                  <input
                    type="text"
                    value={itemForm.companyName}
                    onChange={(e) =>
                      setItemForm((s) => ({
                        ...s,
                        companyName: e.target.value,
                      }))
                    }
                    maxLength={200}
                    disabled={isBusy}
                    className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </label>
                <label className="text-xs text-gray-700 flex flex-col gap-1">
                  Discount
                  <input
                    type="text"
                    value={itemForm.discount}
                    onChange={(e) =>
                      setItemForm((s) => ({ ...s, discount: e.target.value }))
                    }
                    maxLength={300}
                    disabled={isBusy}
                    className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm"
                    required
                  />
                </label>
              </div>
              <label className="text-xs text-gray-700 flex flex-col gap-1">
                Description
                <textarea
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm((s) => ({
                      ...s,
                      description: e.target.value,
                    }))
                  }
                  maxLength={1000}
                  rows={3}
                  disabled={isBusy}
                  className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm"
                  required
                />
              </label>
              <label className="text-xs text-gray-700 flex flex-col gap-1">
                Link
                <input
                  type="url"
                  value={itemForm.link}
                  onChange={(e) =>
                    setItemForm((s) => ({ ...s, link: e.target.value }))
                  }
                  disabled={isBusy}
                  className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm"
                  required
                />
              </label>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg px-3 py-2"
                >
                  <Save size={16} />
                  {itemForm.id ? "Save changes" : "Create item"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelItemForm}
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg px-3 py-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {confirmDelete.kind === "category"
                ? "Delete category?"
                : "Delete item?"}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {confirmDelete.kind === "category"
                ? `This will permanently delete the category "${confirmDelete.title}" and all its items. This cannot be undone.`
                : `This will permanently delete the item "${confirmDelete.label}". This cannot be undone.`}
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={isBusy}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={
                  confirmDelete.kind === "category"
                    ? handleConfirmDeleteCategory
                    : handleConfirmDeleteItem
                }
                disabled={isBusy}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}