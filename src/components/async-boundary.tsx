import { LoadingSpinner } from './ui/loading-spinner'
import { ErrorMessage } from './ui/error-message'

interface AsyncBoundaryProps {
  isLoading: boolean
  error: Error | null
  children: React.ReactNode
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
}

export function AsyncBoundary({
  isLoading,
  error,
  children,
  loadingComponent = <LoadingSpinner className="h-8 w-8" />,
  errorComponent,
}: AsyncBoundaryProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        {loadingComponent}
      </div>
    )
  }

  if (error) {
    return errorComponent ?? <ErrorMessage error={error} className="m-4" />
  }

  return <>{children}</>
} 