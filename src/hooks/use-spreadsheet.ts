import { useState, useCallback } from 'react'
import { spreadsheetService } from '@/services/spreadsheet'

export function useSpreadsheet(spreadsheetId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async (range: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await spreadsheetService.getSpreadsheetData(spreadsheetId, range)
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch spreadsheet data'))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [spreadsheetId])

  const updateData = useCallback(async (range: string, values: any[][]) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await spreadsheetService.updateSpreadsheetData(
        spreadsheetId,
        range,
        values
      )
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update spreadsheet data'))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [spreadsheetId])

  return {
    isLoading,
    error,
    fetchData,
    updateData,
  }
} 