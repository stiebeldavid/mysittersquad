import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'npm:@supabase/supabase-js'
import Airtable from 'npm:airtable'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Airtable.configure({
  apiKey: Deno.env.get('AIRTABLE_API_KEY'),
})

const base = Airtable.base('appbQPN6CeEmayzz1')
const REQUESTS_TABLE = 'tblz6LOxHesVWmmYI'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    console.log('Processing request:', { action, data })

    switch (action) {
      case 'fetch': {
        if (!data?.parentMobile) {
          throw new Error('Parent mobile number is required for fetch action')
        }

        console.log('Fetching requests for parent mobile:', data.parentMobile)
        
        const records = await base(REQUESTS_TABLE)
          .select({
            filterByFormula: `{Parent Requestor Mobile}='${data.parentMobile}'`,
            sort: [{ field: 'Created At', direction: 'desc' }]
          })
          .all()

        console.log(`Found ${records.length} requests`)

        const requests = records.map(record => ({
          id: record.id,
          requestDate: record.get('Request Date'),
          timeRange: record.get('Time Range'),
          babysitterId: record.get('Babysitter ID'),
          babysitterFirstName: record.get('First Name (from Babysitter)'),
          babysitterLastName: record.get('Last Name (from Babysitter)'),
          status: record.get('Status'),
          createdAt: record.get('Created At'),
          babysitterDeleted: record.get('Babysitter Deleted'),
          additionalNotes: record.get('Additional Notes'),
          requestGroupId: record.get('Request Group ID'),
        }))
        
        return new Response(
          JSON.stringify({ requests }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      case 'create': {
        if (!data?.requestDate || !data?.timeRange || !data?.babysitterId || !data?.parentMobile || !data?.requestGroupId) {
          throw new Error('Missing required fields for create action')
        }

        console.log('Creating new request:', data)

        const records = await base(REQUESTS_TABLE).create([
          {
            fields: {
              'Request Date': data.requestDate,
              'Time Range': data.timeRange,
              'Babysitter ID': data.babysitterId,
              'Parent Requestor Mobile': data.parentMobile,
              'Request Group ID': data.requestGroupId,
              'Status': 'Available',
              'Created At': new Date().toISOString(),
              'Additional Notes': data.additionalNotes || '',
            },
          },
        ])

        console.log('Created request:', records[0])
        
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      case 'updateResponse': {
        if (!data?.requestId || !data?.status) {
          throw new Error('Request ID and status are required for updateResponse action')
        }

        console.log('Updating request response:', data)

        const records = await base(REQUESTS_TABLE).update([
          {
            id: data.requestId,
            fields: {
              'Status': data.status,
              'Response': data.response || '',
            },
          },
        ])

        console.log('Updated request:', records[0])
        
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
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})