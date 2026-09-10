import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { SearchBar } from "@/components/landing/SearchBar";
import { FeaturedVehicles } from "@/components/landing/FeaturedVehicles";
import { WhyChooseUs } from "@/components/landing/WhyChooseUs";
import { FinancingCTA } from "@/components/landing/FinancingCTA";
import { Testimonials } from "@/components/landing/Testimonials";
import { Location } from "@/components/landing/Location";
import { Footer } from "@/components/landing/Footer";
import { getPublicVehiclesSummaryServer } from "@/lib/db/vehicles.functions";

export const Route = createFileRoute("/")({
  loader: async () => ({ vehicles: await getPublicVehiclesSummaryServer() }),
  head: () => ({
    title: "C&M Veículos | Confiança que move você",
    meta: [
      {
        name: "description",
        content:
          "Encontre seu próximo carro com procedência e sofisticação na C&M Veículos. Mais de 30 anos de história conectando você aos melhores veículos.",
      },
      { property: "og:title", content: "C&M Veículos | Veículos Novos e Seminovos em Natal/RN" },
      {
        property: "og:description",
        content:
          "Veículos selecionados, revisados e com garantia para você dirigir com segurança e tranquilidade.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { vehicles: initialVehicles } = Route.useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [price, setPrice] = useState("indiferente");
  const [year, setYear] = useState("indiferente");

  const maxPriceNum =
    price === "50k" ? 50000 : price === "100k" ? 100000 : price === "150k" ? 150000 : undefined;
  const yearNum = year !== "indiferente" ? Number(year) : undefined;

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategory("todas");
    setPrice("indiferente");
    setYear("indiferente");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans selection:bg-[#E8231F] selection:text-white">
      <Header />
      <Hero />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        price={price}
        onPriceChange={setPrice}
        year={year}
        onYearChange={setYear}
        onReset={handleResetFilters}
      />
      <FeaturedVehicles
        initialVehicles={initialVehicles}
        searchQuery={searchQuery}
        categoryFilter={category}
        {...(maxPriceNum !== undefined ? { maxPriceFilter: maxPriceNum } : {})}
        {...(yearNum !== undefined ? { yearFilter: yearNum } : {})}
      />
      <WhyChooseUs />
      <FinancingCTA />
      <Testimonials />
      <Location />
      <Footer />
    </main>
  );
}
