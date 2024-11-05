import { SpreadsheetError } from '@/lib/error'

export class SpreadsheetService {
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets'
  private accessToken: string | null = null

  setAuthToken(token: string) {
    this.accessToken = token
  }

  async getSpreadsheetData(spreadsheetId: string, range: string) {
    if (!this.accessToken) {
      throw new SpreadsheetError('Not authenticated')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}/values/${range}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.values
    } catch (error) {
      throw new SpreadsheetError(
        'Error fetching spreadsheet data',
        spreadsheetId,
        range
      )
    }
  }

  async updateSpreadsheetData(
    spreadsheetId: string,
    range: string,
    values: any[][]
  ) {
    if (!this.accessToken) {
      throw new SpreadsheetError('Not authenticated')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      throw new SpreadsheetError(
        'Error updating spreadsheet data',
        spreadsheetId,
        range
      )
    }
  }
}

export const spreadsheetService = new SpreadsheetService() 