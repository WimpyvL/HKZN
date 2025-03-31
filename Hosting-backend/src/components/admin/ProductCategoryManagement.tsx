import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/use-toast";
import { productCategories, CategoryInfo } from "@/lib/productCategories";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CategoryFormData {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ProductCategoryManagement = () => {
  const [categories, setCategories] =
    useState<Record<string, CategoryInfo>>(productCategories);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: "",
    name: "",
    description: "",
    icon: "",
  });

  const handleAddCategory = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      icon: "",
    });
    setShowAddDialog(true);
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories[categoryId];
    if (category) {
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
      });
      setCurrentCategory(categoryId);
      setShowEditDialog(true);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCurrentCategory(categoryId);
    setShowDeleteDialog(true);
  };

  const handleSaveCategory = () => {
    if (!formData.id || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Category ID and name are required",
        variant: "destructive",
      });
      return;
    }

    const newCategories = { ...categories };
    newCategories[formData.id] = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      icon: formData.icon || "Package",
    };

    setCategories(newCategories);
    toast({
      title: "Category Added",
      description: `${formData.name} has been added to categories`,
    });
    setShowAddDialog(false);
  };

  const handleUpdateCategory = () => {
    if (!currentCategory || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    const newCategories = { ...categories };
    newCategories[currentCategory] = {
      ...newCategories[currentCategory],
      name: formData.name,
      description: formData.description,
      icon: formData.icon || newCategories[currentCategory].icon,
    };

    setCategories(newCategories);
    toast({
      title: "Category Updated",
      description: `${formData.name} has been updated successfully`,
    });
    setShowEditDialog(false);
  };

  const handleConfirmDelete = () => {
    if (!currentCategory) return;

    const newCategories = { ...categories };
    delete newCategories[currentCategory];

    setCategories(newCategories);
    toast({
      title: "Category Deleted",
      description: `The category has been deleted successfully`,
    });
    setShowDeleteDialog(false);
  };

  return (
    <Card className="w-full bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Product Categories</h2>
        <Button onClick={handleAddCategory}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="space-y-4">
        {Object.keys(categories).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No categories found. Add your first category to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categories).map(([id, category]) => (
              <Card key={id} className="p-4 border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      ID: {category.id}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCategory(id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategory(id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category for organizing your products.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category ID</Label>
              <Input
                id="categoryId"
                placeholder="e.g. hosting"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                A unique identifier for the category (no spaces)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                id="categoryName"
                placeholder="e.g. Web Hosting"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Input
                id="categoryDescription"
                placeholder="Brief description of the category"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryIcon">Icon Name</Label>
              <Input
                id="categoryIcon"
                placeholder="e.g. Globe, Server, Cloud"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Enter a Lucide icon name (defaults to Package if empty)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the details for this product category.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editCategoryId">Category ID</Label>
              <Input id="editCategoryId" value={formData.id} disabled />
              <p className="text-xs text-gray-500">
                Category ID cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategoryName">Category Name</Label>
              <Input
                id="editCategoryName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategoryDescription">Description</Label>
              <Input
                id="editCategoryDescription"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editCategoryIcon">Icon Name</Label>
              <Input
                id="editCategoryIcon"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">Enter a Lucide icon name</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductCategoryManagement;
