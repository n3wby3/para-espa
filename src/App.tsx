import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import Index from "./pages/Index";
import Proyectos from "./pages/Proyectos";
import Areas from "./pages/Areas";
import Recursos from "./pages/Recursos";
import Archivo from "./pages/Archivo";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/proyectos" element={<Proyectos />} />
              <Route path="/areas" element={<Areas />} />
              <Route path="/recursos" element={<Recursos />} />
              <Route path="/archivo" element={<Archivo />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;