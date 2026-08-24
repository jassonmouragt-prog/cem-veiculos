import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SearchBar } from "@/components/landing/SearchBar";
import { FeaturedVehicles } from "@/components/landing/FeaturedVehicles";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { FinancingCTA } from "@/components/landing/FinancingCTA";
import { Testimonials } from "@/components/landing/Testimonials";
import { Location } from "@/components/landing/Location";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    title: "C&M Veículos | Confiança que move você",
    meta: [
      { name: "description", content: "Encontre seu próximo carro com procedência e sofisticação na C&M Veículos. Mais de 30 anos de história conectando você aos melhores veículos." },
      { property: "og:title", content: "C&M Veículos | Veículos Novos e Seminovos em Teresina" },
      { property: "og:description", content: "Veículos selecionados, revisados e com garantia para você dirigir com segurança e tranquilidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans selection:bg-[#E8231F] selection:text-white">
      <Header />
      <Hero />
      <SearchBar />
      <FeaturedVehicles />
      <WhyChooseUs />
      <FinancingCTA />
      <Testimonials />
      <Location />
      <Footer />
    </main>
  );
}
