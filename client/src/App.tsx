import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import HomeAR from "@/pages/home-ar";
import Success from "@/pages/success";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/ar" component={HomeAR} />
      <Route path="/success" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { CartProvider } from "@/context/cart-context";
import CartDrawer from "@/components/product/cart-drawer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <CartDrawer />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
