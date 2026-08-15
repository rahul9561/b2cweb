interface StepDotsProps {
  total: number
  current: number
}

export default function StepDots({ total, current }: StepDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-7 bg-brand'
              : i < current
                ? 'w-2.5 bg-brand/60'
                : 'w-2.5 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
