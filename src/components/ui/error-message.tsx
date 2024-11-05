interface ErrorMessageProps {
  error: Error | null
  className?: string
}

export function ErrorMessage({ error, className = "" }: ErrorMessageProps) {
  if (!error) return null

  return (
    <div
      className={`rounded-md bg-destructive/15 p-3 text-sm text-destructive ${className}`}
      role="alert"
    >
      <p className="font-medium">Error</p>
      <p>{error.message}</p>
    </div>
  )
} 