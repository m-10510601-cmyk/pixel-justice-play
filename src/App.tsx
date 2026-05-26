import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/game/SettingsContext";
import BgmController from "@/game/BgmController";
import TermsGate from "@/components/TermsGate";
import AutoSaveIndicator from "@/components/AutoSaveIndicator";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Quest from "./pages/Quest.tsx";
import Settings from "./pages/Settings.tsx";
import Store from "./pages/Store.tsx";
import Triumph from "./pages/Triumph.tsx";
import Brief from "./pages/case/Brief.tsx";
import Evidence from "./pages/case/Evidence.tsx";
import Legal from "./pages/case/Legal.tsx";
import VerdictPage from "./pages/case/VerdictPage.tsx";
import Result from "./pages/case/Result.tsx";
import SilentFall from "./pages/story/SilentFall.tsx";
import GreenTrade from "./pages/story/GreenTrade.tsx";
import TheRunner from "./pages/story/TheRunner.tsx";
import SilentRoom from "./pages/story/SilentRoom.tsx";
import MaskOfAuthority from "./pages/story/MaskOfAuthority.tsx";
import RitualOfPower from "./pages/story/RitualOfPower";
import SilentDormitory from "./pages/story/SilentDormitory";
import HighPayTrap from "./pages/story/HighPayTrap";
import DarkNight from "./pages/story/DarkNight";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="brightness-overlay" aria-hidden="true" />
        <AutoSaveIndicator />
        <BrowserRouter>
          <BgmController />
          <TermsGate />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/quest" element={<Quest />} />
            <Route path="/case/:id/brief" element={<Brief />} />
            <Route path="/case/:id/evidence" element={<Evidence />} />
            <Route path="/case/:id/legal" element={<Legal />} />
            <Route path="/case/:id/verdict" element={<VerdictPage />} />
            <Route path="/case/:id/result" element={<Result />} />
            <Route path="/story/silent-fall" element={<SilentFall />} />
            <Route path="/story/green-trade" element={<GreenTrade />} />
            <Route path="/story/the-runner" element={<TheRunner />} />
            <Route path="/story/silent-room" element={<SilentRoom />} />
            <Route path="/story/mask-of-authority" element={<MaskOfAuthority />} />
            <Route path="/story/ritual-of-power" element={<RitualOfPower />} />
            <Route path="/story/silent-dormitory" element={<SilentDormitory />} />
            <Route path="/story/high-pay-trap" element={<HighPayTrap />} />
            <Route path="/story/dark-night" element={<DarkNight />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/store" element={<Store />} />
            <Route path="/triumph" element={<Triumph />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
