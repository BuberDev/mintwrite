import { createPool, VercelPool } from '@vercel/postgres'

let pool: VercelPool | null = null

export const getPool = () => {
  if (!pool) {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL is not defined. Please check your environment variables.')
    }
    pool = createPool({
      connectionString: process.env.POSTGRES_URL,
    })
  }
  return pool
}

// Proxy the db object to the pool
export const db = new Proxy({} as VercelPool, {
  get: (target, prop) => {
    const p = getPool()
    return (p as any)[prop]
  }
})

// Helper to handle simple queries
export async function query<T>(text: string, params?: any[]) {
  const start = Date.now()
  const res = await getPool().query(text, params)
  const duration = Date.now() - start
  console.log('Executed query', { text, duration, rows: res.rowCount })
  return res
}

// User helpers
export async function getOrCreateUser(clerkId: string, email: string) {
  const res = await getPool().query(
    'SELECT * FROM users WHERE id = $1',
    [clerkId]
  )
  
  if (res.rows.length > 0) {
    return res.rows[0]
  }

  const insertRes = await getPool().query(
    'INSERT INTO users (id, email) VALUES ($1, $2) RETURNING *',
    [clerkId, email]
  )
  return insertRes.rows[0]
}
