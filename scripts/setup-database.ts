import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    // Read schema.sql file
    const schemaPath = path.join(__dirname, '..', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Execute schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema })

    if (error) {
      console.error('Error setting up database:', error)
      process.exit(1)
    }

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

setupDatabase() 