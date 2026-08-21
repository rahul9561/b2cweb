interface HealthProgressBarProps {
  /** 0–100 progress value */
  progress: number
}

export default function HealthProgressBar({ progress }: HealthProgressBarProps) {
  return (
    <div className="relative h-1.5 w-full bg-green-cta/10">
      <div
        className="absolute inset-y-0 left-0 rounded-r-full bg-green-cta transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
      {progress > 0 && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-cta mix-blend-multiply">
          {progress}%
        </span>
      )}
    </div>
  )
}
