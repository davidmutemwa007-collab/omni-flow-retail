import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store as StoreIcon, 
  Package, 
  ShoppingCart, 
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  ChevronDown,
  TrendingUp,
  AlertCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  CheckCircle2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

import { Product, Store, InventoryItem, Sale, SaleItem, User } from './types';
import { MOCK_USER, MOCK_STORES, MOCK_PRODUCTS, MOCK_INVENTORY } from './lib/mock-data';

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, currentStore, stores, onStoreChange }: any) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'stores', label: 'My Stores', icon: StoreIcon },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl tracking-tight">OmniPay</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between mb-8 overflow-hidden">
              <div className="flex items-center gap-2 truncate">
                <StoreIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{currentStore?.name || 'Select Store'}</span>
              </div>
              <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {stores.map((store: Store) => (
              <DropdownMenuItem key={store.id} onClick={() => onStoreChange(store)}>
                {store.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="w-4 h-4 mr-2" />
              Add New Store
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-medium' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_USER.name}`} alt="avatar" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{MOCK_USER.name}</span>
            <span className="text-xs text-muted-foreground capitalize">{MOCK_USER.role}</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const Dashboard = ({ sales, currentStore, products, inventory }: any) => {
  const storeSales = sales.filter((s: Sale) => s.storeId === currentStore.id);
  const totalRevenue = storeSales.reduce((acc: number, s: Sale) => acc + s.total, 0);
  const avgOrder = storeSales.length ? totalRevenue / storeSales.length : 0;
  
  const lowStockItems = inventory.filter((item: InventoryItem) => 
    item.storeId === currentStore.id && item.quantity <= item.lowStockThreshold
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at {currentStore.name}.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Transactions</span>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">{storeSales.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+4 new sales today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Avg. Order Value</span>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">${avgOrder.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Steady growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Low Stock Alerts</span>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions from this location.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No sales recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  storeSales.slice(-5).reverse().map((sale: Sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">#{sale.id.slice(0, 8)}</TableCell>
                      <TableCell>{new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                      <TableCell>${sale.total.toFixed(2)}</TableCell>
                      <TableCell className="capitalize">{sale.paymentMethod.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0">
                          {sale.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Critical stock updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-2" />
                <p>All stock levels healthy!</p>
              </div>
            ) : (
              lowStockItems.map((item: InventoryItem) => {
                const product = products.find((p: Product) => p.id === item.productId);
                return (
                  <div key={item.productId} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-background border flex items-center justify-center">
                        <Package className="w-5 h-5 opacity-50" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product?.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product?.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">{item.quantity} left</p>
                      <p className="text-[10px] text-muted-foreground uppercase">Threshold: {item.lowStockThreshold}</p>
                    </div>
                  </div>
                );
              })
            )}
            <Button variant="outline" className="w-full mt-4">
              View All Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const POS = ({ currentStore, products, inventory, onSaleComplete }: any) => {
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile_money' | null>(null);
  const [processing, setProcessing] = useState(false);

  const categories = ['All', ...new Set(products.map((p: Product) => p.category))];

  const filteredProducts = products.filter((p: Product) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const saleItems: SaleItem[] = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      priceAtSale: item.product.price
    }));

    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 15),
      storeId: currentStore.id,
      timestamp: Date.now(),
      items: saleItems,
      total,
      paymentMethod,
      status: 'completed'
    };

    onSaleComplete(newSale);
    setProcessing(false);
    setShowCheckout(false);
    setCart([]);
    setPaymentMethod(null);
    toast.success('Sale completed successfully!');
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left: Product Selection */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products or SKU..." 
              className="pl-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map((cat: any) => (
              <Button 
                key={cat} 
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product: Product) => {
              const stock = inventory.find((i: InventoryItem) => i.productId === product.id && i.storeId === currentStore.id)?.quantity || 0;
              return (
                <Card 
                  key={product.id} 
                  className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 group ${stock === 0 ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-square w-full relative overflow-hidden bg-secondary">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {stock <= 5 && stock > 0 && (
                      <Badge className="absolute top-2 right-2 bg-orange-500">Low Stock</Badge>
                    )}
                    {stock === 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">Out of Stock</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                    <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                      <span className="text-[10px] text-muted-foreground">In stock: {stock}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-96 border-l bg-card flex flex-col">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-bold text-lg">Current Order</h2>
          <Button variant="ghost" size="sm" onClick={() => setCart([])} disabled={cart.length === 0}>
            Clear
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <ShoppingCart className="w-12 h-12 mb-2" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="w-12 h-12 rounded overflow-hidden bg-secondary">
                  <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground">${item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded-lg bg-background">
                    <button 
                      className="p-1 hover:bg-secondary rounded-l-lg"
                      onClick={() => updateQuantity(item.product.id, -1)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button 
                      className="p-1 hover:bg-secondary rounded-r-lg"
                      onClick={() => updateQuantity(item.product.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-sm font-bold w-16 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t bg-secondary/20 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (0%)</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20"
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
          >
            Checkout
          </Button>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Sale</DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Amount Due</p>
              <h2 className="text-4xl font-black">${total.toFixed(2)}</h2>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-bold">Card</span>
                </button>
                <button
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <Banknote className="w-6 h-6" />
                  <span className="text-xs font-bold">Cash</span>
                </button>
                <button
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'mobile_money' ? 'border-primary bg-primary/5' : 'hover:bg-secondary'
                  }`}
                  onClick={() => setPaymentMethod('mobile_money')}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-xs font-bold">Mobile</span>
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 bg-secondary rounded-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs">Terminal ready. Waiting for card insert/tap...</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCheckout(false)} disabled={processing}>Cancel</Button>
            <Button 
              className="px-8 min-w-[150px]" 
              disabled={!paymentMethod || processing}
              onClick={handleCheckout}
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : 'Confirm Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InventoryView = ({ currentStore, products, inventory, updateStock }: any) => {
  const [activeTab, setActiveTab] = useState('stock');
  const [searchTerm, setSearchTerm] = useState('');

  const storeInventory = products.map((p: Product) => {
    const inv = inventory.find((i: InventoryItem) => i.productId === p.id && i.storeId === currentStore.id);
    return {
      ...p,
      quantity: inv?.quantity || 0,
      threshold: inv?.lowStockThreshold || 0
    };
  }).filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
       <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage products and stock levels for {currentStore.name}.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </header>

      <Tabs defaultValue="stock" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="stock">Current Stock</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="stock" className="border rounded-xl bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Product</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeInventory.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded bg-secondary overflow-hidden">
                      <img src={p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${p.quantity <= p.threshold ? 'bg-orange-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (p.quantity / 50) * 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${p.quantity <= p.threshold ? 'text-orange-600' : ''}`}>
                        {p.quantity} units
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${p.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => updateStock(p.id, currentStore.id, 10)}>
                      Add 10
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStore, setCurrentStore] = useState<Store>(MOCK_STORES[0]);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [sales, setSales] = useState<Sale[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSales = localStorage.getItem('omnipos_sales');
    const savedInventory = localStorage.getItem('omnipos_inventory');
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('omnipos_sales', JSON.stringify(sales));
    localStorage.setItem('omnipos_inventory', JSON.stringify(inventory));
  }, [sales, inventory]);

  const handleSaleComplete = (newSale: Sale) => {
    setSales([...sales, newSale]);
    
    // Update inventory levels
    const updatedInventory = inventory.map(item => {
      if (item.storeId === newSale.storeId) {
        const saleItem = newSale.items.find(si => si.productId === item.productId);
        if (saleItem) {
          return { ...item, quantity: Math.max(0, item.quantity - saleItem.quantity) };
        }
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const updateStock = (productId: string, storeId: string, amount: number) => {
    setInventory(prev => prev.map(item => {
      if (item.productId === productId && item.storeId === storeId) {
        return { ...item, quantity: item.quantity + amount };
      }
      return item;
    }));
    toast.success(`Restocked ${amount} units`);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard sales={sales} currentStore={currentStore} products={products} inventory={inventory} />;
      case 'pos':
        return <POS currentStore={currentStore} products={products} inventory={inventory} onSaleComplete={handleSaleComplete} />;
      case 'inventory':
        return <InventoryView currentStore={currentStore} products={products} inventory={inventory} updateStock={updateStock} />;
      case 'stores':
        return (
          <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
             <header className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Manage Stores</h1>
                <p className="text-muted-foreground">Manage your chain of retail locations.</p>
              </div>
              <Button><Plus className="w-4 h-4 mr-2" />Add New Store</Button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_STORES.map(store => (
                <Card key={store.id} className={currentStore.id === store.id ? 'ring-2 ring-primary' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={store.type === 'chain' ? 'default' : 'outline'}>
                        {store.type === 'chain' ? 'Chain Branch' : 'Independent'}
                      </Badge>
                      {currentStore.id === store.id && (
                        <Badge className="bg-emerald-500">Active</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-4">{store.name}</CardTitle>
                    <CardDescription>{store.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setCurrentStore(store)}
                      disabled={currentStore.id === store.id}
                    >
                      {currentStore.id === store.id ? 'Current Store' : 'Switch to Store'}
                    </Button>
                    <Button variant="ghost" size="icon"><ArrowRight className="w-4 h-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8 max-w-2xl mx-auto w-full space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input defaultValue={MOCK_USER.name} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue={MOCK_USER.email} />
                </div>
                <Button>Update Profile</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">Used for all transactions</p>
                  </div>
                  <Badge variant="outline">USD ($)</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <p className="font-medium">Receipt Logo</p>
                    <p className="text-sm text-muted-foreground">Shown on printed and digital receipts</p>
                  </div>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentStore={currentStore}
        stores={MOCK_STORES}
        onStoreChange={(s: Store) => {
          setCurrentStore(s);
          toast.info(`Switched to ${s.name}`);
        }}
      />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (currentStore?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}