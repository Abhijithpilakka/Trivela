export default function Loading() {
  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <span className="text-xs font-body tracking-[0.2em] uppercase text-muted">Loading</span>
      </div>
    </div>
  )
}
