import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/db/store";
import { useSiteSettings } from "@/lib/site/use-site-settings";

export function Location() {
  const { whatsappPrimary, address, city, hoursWeekdays, hoursSaturday } = useSiteSettings();
  const fullAddress = `${address}, ${city}`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="localizacao" className="bg-[#0a0a0a] py-12 lg:py-16">
      <div className="container mx-auto grid items-center gap-8 px-4 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-5">
          <Badge
            variant="secondary"
            className="bg-[#E8231F]/10 border border-[#E8231F]/20 text-[#E8231F] font-semibold text-xs rounded-full py-0.5 px-3"
          >
            VISITE NOSSO SHOWROOM
          </Badge>
          <h2 className="max-w-xl text-2xl font-bold text-white tracking-tight sm:text-3xl lg:text-4xl">
            {address}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Venha tomar um café conosco, conhecer nosso estoque pessoalmente e receber um
            atendimento exclusivo e personalizado.
          </p>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8231F]/15 text-[#E8231F]">
              <Clock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-medium text-white">Horário de Funcionamento</p>
              <p className="text-gray-400">{hoursWeekdays}</p>
              <p className="text-gray-400">{hoursSaturday}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-3">
            <a
              href={buildWhatsAppUrl(whatsappPrimary, "Olá! Gostaria de agendar uma visita.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full sm:w-auto h-10 sm:h-11 gap-2 bg-brand-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-sm shadow-[#E8231F]/15">
                <Phone className="w-4 h-4" /> Fale no WhatsApp
              </Button>
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-10 sm:h-11 border-white/10 hover:bg-white/5 text-gray-200 font-semibold text-xs sm:text-sm gap-2 rounded-lg"
              >
                <MapPin className="w-4 h-4 text-[#E8231F]" /> Como chegar
              </Button>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl overflow-hidden aspect-square border border-white/5 shadow-md bg-[#121212]">
            <iframe
              src={`${mapsUrl}&output=embed`}
              title={`Mapa C&M Veículos — ${fullAddress}`}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="rounded-2xl overflow-hidden aspect-square relative bg-[#121212] border border-white/5 flex items-center justify-center p-6 text-center shadow-md">
            <div className="space-y-3">
              <div className="h-10 w-10 bg-brand-gradient rounded-xl mx-auto flex items-center justify-center text-white font-bold text-sm shadow-sm">
                CM
              </div>
              <h3 className="font-bold text-white text-base">C&M Veículos</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{fullAddress}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[#E8231F] hover:underline text-xs font-semibold pt-1"
              >
                Abrir no Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
