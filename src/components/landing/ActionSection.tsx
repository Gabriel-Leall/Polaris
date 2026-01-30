import Link from "next/link";

export const ActionSection = () => {
  return (
    <section className="w-full bg-background px-6 md:px-12 pt-40 pb-[200px]">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-[-0.02em] text-foreground max-w-[800px]">
          Troque o estado mental, não só a ferramenta.
        </h2>

        <p className="mt-8 text-base md:text-lg font-normal leading-relaxed text-foreground/60 max-w-[650px]">
          Junte-se a [X] pessoas que recuperaram o foco. O Polaris não te dá 20%
          mais tempo; ele te devolve o tempo que você perdia clicando em abas.
        </p>

        <Link
          href="/login"
          className="mt-[60px] inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-sm font-semibold text-[#FAFAFA] shadow-[12px_12px_24px_rgba(15,23,42,0.12),_-10px_-10px_24px_rgba(255,255,255,0.6)] transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:shadow-[0_20px_40px_rgba(59,130,246,0.15)]"
          style={{ touchAction: "manipulation" }}
        >
          Entrar no Polaris
        </Link>
      </div>
    </section>
  );
};
