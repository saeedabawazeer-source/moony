import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { Product, Collection } from "@shared/schema";

export default function Checkout() {
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: ""
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });

  const currentProduct = products.find(p => p.id === selectedProduct);
  const currentCollection = collections.find(c => c.id === currentProduct?.collection);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/create-charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: selectedProduct,
          quantity,
          customer: formData,
          origin: window.location.origin
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment gateway error: " + data.message);
      }
    } catch (err) {
      alert("There was an issue processing your payment.");
    }
  };

  const subtotal = currentProduct ? parseFloat(currentProduct.price) * quantity : 0;
  const shipping = 56.25;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl lg:text-4xl font-serif font-semibold text-gray-900 mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Form */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Selection</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Select onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - SAR {product.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {currentProduct && (
                  <>
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Select onValueChange={setSelectedSize}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {currentProduct.sizes.map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    required
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {currentProduct && currentCollection ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={currentProduct.mainImage} 
                      alt={currentProduct.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${currentCollection.color === 'coral' ? 'text-coral' : 'text-teal'}`}>
                        {currentProduct.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Size: {selectedSize || "Not selected"} | Qty: {quantity}
                      </p>
                    </div>
                    <span className="font-medium">SAR {currentProduct.price}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <h4 className="font-medium">Set Includes:</h4>
                    <ul className="space-y-1">
                      {currentProduct.includes.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${currentCollection.color === 'coral' ? 'bg-coral' : 'bg-teal'}`}></span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>SAR {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>SAR {shipping.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>SAR {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${currentCollection.color === 'coral' ? 'bg-coral hover:bg-coral/90' : 'bg-teal hover:bg-teal/90'} text-white`}
                    onClick={handleSubmit}
                    disabled={!selectedProduct || !selectedSize}
                  >
                    Complete Order
                  </Button>

                  <div className="text-center space-y-2 text-sm text-gray-600">
                    <p>We'll contact you to complete payment</p>
                    <div className="flex justify-center space-x-4">
                      <a href="mailto:contact@moonyswimwear.com" className="hover:text-coral transition-colors">
                        <i className="fas fa-envelope"></i> Email
                      </a>
                      <a href="tel:+1234567890" className="hover:text-coral transition-colors">
                        <i className="fas fa-phone"></i> Phone
                      </a>
                      <a href="https://www.instagram.com/moonyswimwear" className="hover:text-coral transition-colors">
                        <i className="fab fa-instagram"></i> Instagram
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select a product to see order summary
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}