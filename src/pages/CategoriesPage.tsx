
import { useState, useEffect } from "react";
import { Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getUserCategories,
} from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, Tag } from "lucide-react";
import CategoryForm from "@/components/categories/CategoryForm";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CategoriesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedCategories = await getUserCategories(user.uid);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, [user, toast]);
  
  const handleAddCategory = async (category: Omit<Category, "id" | "createdAt">) => {
    if (!user) return;
    
    try {
      const { id } = await addCategory(category);
      
      // Add category to the state with the new ID
      const newCategory: Category = {
        ...category,
        id,
        createdAt: new Date(),
      };
      
      setCategories(prev => [...prev, newCategory]);
      setIsModalOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateCategory = async (category: Omit<Category, "id" | "createdAt">) => {
    if (!user || !selectedCategory) return;
    
    try {
      await updateCategory(selectedCategory.id, category);
      
      // Update category in the state
      setCategories(prev => 
        prev.map(c => 
          c.id === selectedCategory.id 
            ? { ...c, ...category }
            : c
        )
      );
      
      setIsModalOpen(false);
      setSelectedCategory(undefined);
      
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteCategory = async (id: string) => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to delete this category? This may affect transactions using this category.")) {
      return;
    }
    
    try {
      await deleteCategory(id);
      
      // Remove category from the state
      setCategories(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };
  
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };
  
  // Separate categories by type
  const incomeCategories = categories.filter(c => c.type === "income");
  const expenseCategories = categories.filter(c => c.type === "expense");
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your transaction categories
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedCategory(undefined);
            setIsModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-finance-navy hover:bg-finance-navy/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-medium mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-6">
            Categories help you organize your transactions
          </p>
          <Button 
            onClick={() => {
              setSelectedCategory(undefined);
              setIsModalOpen(true);
            }}
            className="bg-finance-navy hover:bg-finance-navy/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Category
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5 text-finance-emerald" />
                Income Categories
              </CardTitle>
              <CardDescription>
                Categories for tracking your income sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomeCategories.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No income categories yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomeCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-finance-emerald/10 text-finance-emerald border-finance-emerald/20">
                              Income
                            </Badge>
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory(undefined);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Income Category
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="animate-enter">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="mr-2 h-5 w-5 text-destructive" />
                Expense Categories
              </CardTitle>
              <CardDescription>
                Categories for tracking your expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expenseCategories.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No expense categories yet
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                              Expense
                            </Badge>
                            {category.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSelectedCategory(undefined);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Expense Category
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedCategory(undefined);
            }}
            initialData={selectedCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
