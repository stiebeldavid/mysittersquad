import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js'
import Airtable from 'npm:airtable'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure Airtable
const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY')
if (!AIRTABLE_API_KEY) {
  throw new Error('AIRTABLE_API_KEY is required')
}

Airtable.configure({
  apiKey: AIRTABLE_API_KEY,
})

const base = Airtable.base('appbQPN6CeEmayzz1')
const BABYSITTERS_TABLE = 'tblOHkVqPWEus4ENk'

// Helper function to normalize phone numbers
const normalizePhoneNumber = (phone: string) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  // Ensure it starts with +
  return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`
}

serve(async (req) => {
  // Add detailed logging
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  })

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    })
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('Missing authorization header')
      throw new Error('Missing authorization header')
    }

    // Get request body
    const { action, data } = await req.json()
    console.log('Processing request:', { action, data })

    switch (action) {
      case 'fetch': {
        if (!data?.parentMobile) {
          console.error('Parent mobile number is required for fetch action')
          throw new Error('Parent mobile number is required for fetch action')
        }

        const normalizedMobile = normalizePhoneNumber(data.parentMobile)
        console.log('Fetching babysitters for normalized parent mobile:', normalizedMobile)
        
        const records = await base(BABYSITTERS_TABLE)
          .select({
            filterByFormula: `{Parent Owner Mobile}='${normalizedMobile}'`,
          })
          .all()

        console.log(`Found ${records.length} babysitters`)

        const babysitters = records.map(record => ({
          id: record.id,
          firstName: record.get('First Name'),
          lastName: record.get('Last Name'),
          mobile: record.get('Mobile'),
          email: record.get('Email'),
          age: record.get('Age'),
          grade: record.get('Grade'),
          rate: record.get('Rate'),
          specialties: record.get('Specialties'),
          notes: record.get('Notes'),
          babysitterId: record.get('Babysitter ID'),
        }))
        
        return new Response(
          JSON.stringify({ babysitters }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            }
          }
        )
      }

      case 'create': {
        if (!data?.firstName || !data?.mobile || !data?.parentMobile) {
          throw new Error('First name, mobile number, and parent mobile are required for create action')
        }

        console.log('Creating new babysitter:', data)

        const records = await base(BABYSITTERS_TABLE).create([
          {
            fields: {
              'First Name': data.firstName,
              'Last Name': data.lastName,
              'Mobile': data.mobile,
              'Parent Owner Mobile': data.parentMobile,
              'Age': data.age,
              'Grade': data.grade,
              'Rate': data.rate,
              'Specialties': data.specialties,
              'Notes': data.notes,
              'Email': data.email,
            },
          },
        ])

        console.log('Created babysitter:', records[0])
        
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      case 'update': {
        if (!data?.id || !data?.firstName || !data?.mobile) {
          throw new Error('ID, first name, and mobile number are required for update action')
        }

        console.log('Updating babysitter:', data)

        const records = await base(BABYSITTERS_TABLE).update([
          {
            id: data.id,
            fields: {
              'First Name': data.firstName,
              'Last Name': data.lastName,
              'Mobile': data.mobile,
              'Age': data.age,
              'Grade': data.grade,
              'Rate': data.rate,
              'Specialties': data.specialties,
              'Notes': data.notes,
              'Email': data.email,
            },
          },
        ])

        console.log('Updated babysitter:', records[0])
        
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      case 'delete': {
        if (!data?.id) {
          throw new Error('ID is required for delete action')
        }

        console.log('Deleting babysitter:', data)

        const records = await base(BABYSITTERS_TABLE).destroy([data.id])

        console.log('Deleted babysitter:', records[0])
        
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      default:
        throw new Error(`Unsupported action: ${action}`)
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})