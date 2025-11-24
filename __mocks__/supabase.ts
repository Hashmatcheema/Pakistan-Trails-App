/**
 * Mock Supabase client for testing
 */
import { vi } from 'vitest'

export const createMockSupabaseClient = () => {
  const mockData: Record<string, any[]> = {}
  const mockError: Record<string, any> = {}
  const mockCount: Record<string, number> = {}

  const createQueryBuilder = (table: string) => {
    const query: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      like: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      not: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        const error = mockError[table]
        const data = (mockData[table] || [])[0] || null
        
        if (error) {
          return Promise.resolve({ data: null, error })
        }
        
        return Promise.resolve({ data, error: null })
      }),
    }

    // Mock the final execution methods (range, then, etc.)
    query.range = vi.fn().mockImplementation((from: number, to: number) => {
      const error = mockError[table]
      const allData = mockData[table] || []
      const count = mockCount[table] ?? allData.length
      const paginatedData = allData.slice(from, to + 1)
      
      if (error) {
        return Promise.resolve({ data: null, error, count: null })
      }
      
      return Promise.resolve({ data: paginatedData, error: null, count })
    })

    // Make query thenable
    query.then = async (resolve: any) => {
      const error = mockError[table]
      const data = mockData[table] || []
      const count = mockCount[table] ?? data.length
      
      if (error) {
        return resolve({ data: null, error, count: null })
      }
      
      return resolve({ data, error: null, count })
    }

    return query
  }

  return {
    from: vi.fn((table: string) => createQueryBuilder(table)),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    // Helper methods for tests
    _setMockData: (table: string, data: any[]) => {
      mockData[table] = data
    },
    _setMockError: (table: string, error: any) => {
      mockError[table] = error
    },
    _setMockCount: (table: string, count: number) => {
      mockCount[table] = count
    },
    _clearMocks: () => {
      Object.keys(mockData).forEach(key => delete mockData[key])
      Object.keys(mockError).forEach(key => delete mockError[key])
      Object.keys(mockCount).forEach(key => delete mockCount[key])
    },
  }
}

export const mockSupabaseClient = createMockSupabaseClient()
