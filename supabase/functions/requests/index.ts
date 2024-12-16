import { createClient } from '@supabase/supabase-js'
import Airtable from 'npm:airtable'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Airtable.configure({
  apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base('appbQPN6CeEmayzz1');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    console.log('Processing request:', { action, data })

    switch (action) {
      case 'create':
        const record = await base('Requests').create([
          {
            fields: {
              'Parent Mobile': data.parentMobile,
              'Babysitter Mobile': data.babysitterMobile,
              'Start Time': data.startTime,
              'End Time': data.endTime,
              'Status': 'Pending',
              'Created At': new Date().toISOString(),
              'Kids': data.kids,
              'Street Address': data.streetAddress,
              'City': data.city,
              'State': data.state,
              'Zip Code': data.zipCode,
              'Notes': data.notes || '',
            },
          },
        ]);

        return new Response(
          JSON.stringify({ record: record[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'fetch':
        const records = await base('Requests')
          .select({
            filterByFormula: `OR({Parent Mobile}='${data.mobile}', {Babysitter Mobile}='${data.mobile}')`,
            sort: [{ field: 'Created At', direction: 'desc' }],
          })
          .all();

        return new Response(
          JSON.stringify({ records }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update':
        const updatedRecord = await base('Requests').update(data.id, {
          'Status': data.status,
          'Response Notes': data.responseNotes || '',
        });

        return new Response(
          JSON.stringify({ record: updatedRecord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

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