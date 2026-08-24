import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Star, ArrowLeft, ArrowRight, ImagePlus, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  mainImageIndex: number;
  onChangeImages: (images: string[]) => void;
  onChangeMainImage: (index: number) => void;
}

export function ImageUploader({
  images,
  mainImageIndex,
  onChangeImages,
  onChangeMainImage,
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFiles: Promise<string>[] = Array.from(files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readFiles).then((newImageUrls) => {
      onChangeImages([...images, ...newImageUrls]);
      toast.success(`${newImageUrls.length} imagem(ns) adicionada(s)!`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput.trim());
      onChangeImages([...images, urlInput.trim()]);
      setUrlInput("");
      setShowUrlInput(false);
      toast.success("Imagem adicionada com sucesso!");
    } catch {
      toast.error("Por favor, insira uma URL válida de imagem.");
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChangeImages(updated);
    if (mainImageIndex >= updated.length) {
      onChangeMainImage(Math.max(0, updated.length - 1));
    }
    toast.info("Imagem removida.");
  };

  const handleMove = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updated = [...images];
    const temp = updated[index];
    if (temp === undefined || updated[targetIndex] === undefined) return;
    updated[index] = updated[targetIndex]!;
    updated[targetIndex] = temp;

    // Adjust main image index if moved
    if (mainImageIndex === index) {
      onChangeMainImage(targetIndex);
    } else if (mainImageIndex === targetIndex) {
      onChangeMainImage(index);
    }

    onChangeImages(updated);
  };


  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-brand-gradient hover:opacity-90 text-white text-xs sm:text-sm font-semibold h-10 gap-2 rounded-lg"
        >
          <Upload className="w-4 h-4" />
          Fazer Upload de Fotos
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="border-white/10 hover:bg-white/5 text-gray-200 text-xs sm:text-sm h-10 gap-2 rounded-lg"
        >
          <LinkIcon className="w-4 h-4 text-[#E8231F]" />
          Adicionar por Link URL
        </Button>
      </div>

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="flex gap-2 p-3 bg-black/50 border border-white/10 rounded-xl">
          <Input
            placeholder="Cole o link da imagem (ex: https://exemplo.com/foto.jpg)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-[#121212] border-white/10 text-white text-xs sm:text-sm h-10"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
          />
          <Button
            type="button"
            onClick={handleAddUrl}
            className="bg-[#E8231F] hover:bg-[#E8231F]/90 text-white text-xs font-semibold h-10 px-4"
          >
            Adicionar
          </Button>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-xl bg-black/20 hover:border-[#E8231F]/50 cursor-pointer transition-colors text-center"
        >
          <ImagePlus className="w-10 h-10 text-gray-500 mb-2" />
          <p className="text-sm font-semibold text-white">Nenhuma foto adicionada ainda</p>
          <p className="text-xs text-gray-400 mt-1">Clique para selecionar fotos do seu computador ou celular</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((imgUrl, index) => {
            const isCover = index === mainImageIndex;
            return (
              <div
                key={index}
                className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-black transition-all ${
                  isCover ? "border-[#E8231F] shadow-lg shadow-[#E8231F]/20" : "border-white/10 hover:border-white/30"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Cover badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-[#E8231F] text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                    Foto de Capa
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => onChangeMainImage(index)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isCover ? "bg-[#E8231F] text-white" : "bg-black/70 text-gray-300 hover:text-yellow-400 hover:bg-black"
                      }`}
                      title={isCover ? "Capa Principal" : "Definir como Capa"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isCover ? "fill-white" : ""}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Remover foto"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Ordering arrows */}
                  <div className="flex justify-center gap-2">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMove(index, "left")}
                        className="p-1 bg-black/80 hover:bg-white/20 text-white rounded transition-colors"
                        title="Mover para a esquerda"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMove(index, "right")}
                        className="p-1 bg-black/80 hover:bg-white/20 text-white rounded transition-colors"
                        title="Mover para a direita"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
