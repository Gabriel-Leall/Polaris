interface BentoGridProps {
  children: React.ReactNode
}

export default function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="col-span-11 grid grid-cols-12 gap-6">
      {children}
    </div>
  )
}