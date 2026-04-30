import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Quest from "./pages/Quest.tsx";
import Settings from "./pages/Settings.tsx";
import Store from "./pages/Store.tsx";
import Triumph from "./pages/Triumph.tsx";
import Chapter from "./pages/Chapter.tsx";
import Brief from "./pages/case/Brief.tsx";
import Evidence from "./pages/case/Evidence.tsx";
import Legal from "./pages/case/Legal.tsx";
import VerdictPage from "./pages/case/VerdictPage.tsx";
import Result from "./pages/case/Result.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quest" element={<Quest />} />
          <Route path="/chapter/:chapter" element={<Chapter />} />
          <Route path="/case/:id/brief" element={<Brief />} />
          <Route path="/case/:id/evidence" element={<Evidence />} />
          <Route path="/case/:id/legal" element={<Legal />} />
          <Route path="/case/:id/verdict" element={<VerdictPage />} />
          <Route path="/case/:id/result" element={<Result />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/store" element={<Store />} />
          <Route path="/triumph" element={<Triumph />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
