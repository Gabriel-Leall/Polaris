interface BentoGridProps {
  children: React.ReactNode
}

function BentoGrid({ children }: BentoGridProps) {
  return (
    <div className="col-span-11 grid grid-cols-12 gap-6">
      {children}
    </div>
  )
}

export default BentoGrid
export { BentoGrid }