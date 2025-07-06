import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

const languages = [
  { code: "pt-BR", label: "Português", flag: "🇧🇷" },
  { code: "en-US", label: "English", flag: "🇺🇸" },
  { code: "es-ES", label: "Español", flag: "🇪🇸" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n();
  
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];
  
  const handleLanguageChange = () => {
    const currentIndex = languages.findIndex(lang => lang.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex].code as any);
  };

  return (
    <div className="w-full bg-red-100 p-2 border border-red-300 rounded">
      <p className="text-xs text-red-600 mb-1">TESTE - Seletor de Idioma</p>
      <Button
        variant="outline"
        size="sm"
        className="w-full h-9 text-sm justify-start gap-2 bg-blue-100"
        onClick={handleLanguageChange}
      >
        <Languages className="h-4 w-4" />
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
      </Button>
    </div>
  );
}