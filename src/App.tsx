import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import Dashboard from "./pages/Dashboard";
import Saisie from "./pages/Saisie";
import NouvelleAffaire from "./pages/NouvelleAffaire";
import DetailsAffaire from "./pages/DetailsAffaire";
import Historique from "./pages/Historique";
import Configuration from "./pages/Configuration";
import Statistiques from "./pages/Statistiques";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
          <Route path="/" element={<Layout><PageTransition><Dashboard /></PageTransition></Layout>} />
          <Route path="/nouvelle-affaire" element={<Layout><PageTransition><NouvelleAffaire /></PageTransition></Layout>} />
          <Route path="/nouvelle-affaire/:id" element={<Layout><PageTransition><NouvelleAffaire /></PageTransition></Layout>} />
          <Route path="/affaire/:id" element={<Layout><PageTransition><DetailsAffaire /></PageTransition></Layout>} />
          <Route path="/saisie/:affaireId" element={<Layout><PageTransition><Saisie /></PageTransition></Layout>} />
          <Route path="/historique" element={<Layout><PageTransition><Historique /></PageTransition></Layout>} />
          <Route path="/configuration" element={<Layout><PageTransition><Configuration /></PageTransition></Layout>} />
          <Route path="/statistiques" element={<Layout><PageTransition><Statistiques /></PageTransition></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
