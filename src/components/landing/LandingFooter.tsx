import { AxisIcon } from "@/components/ui/AxisIcon";

export const LandingFooter = () => {
  return (
    <footer className="flex justify-center w-full py-8 border-t border-border bg-background">
      <div className="flex flex-col gap-4 text-center">
        {/* Polaris Icon */}
        <div className="flex justify-center mb-2">
          <AxisIcon size={40} interactive={false} />
        </div>
        <p className="text-muted-foreground text-xs font-normal leading-normal font-mono">
          Axis v1.0. Sistema pronto.
        </p>
        <div className="flex gap-6 justify-center">
          <a
            className="text-muted-foreground hover:text-foreground text-[10px] font-mono transition-colors"
            href="/privacy"
          >
            Política de Privacidade
          </a>
          <a
            className="text-muted-foreground hover:text-foreground text-[10px] font-mono transition-colors"
            href="/terms"
          >
            Termos de Uso
          </a>
          <a
            className="text-muted-foreground hover:text-foreground text-[10px] font-mono transition-colors"
            href="#"
          >
            Twitter
          </a>
          <a
            className="text-muted-foreground hover:text-foreground text-[10px] font-mono transition-colors"
            href="#"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};
