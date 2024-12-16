import { createClient } from 'npm:@supabase/supabase-js'
import Airtable from 'npm:airtable'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Airtable.configure({
  apiKey: Deno.env.get('AIRTABLE_API_KEY'),
});

const base = Airtable.base('appbQPN6CeEmayzz1');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { mobile, action, data } = await req.json()
    console.log('Processing user request:', { action, mobile })

    switch (action) {
      case 'findByMobile':
        console.log('Looking up user by mobile:', mobile)
        const records = await base('Users')
          .select({
            filterByFormula: `{Mobile}='${mobile}'`,
            maxRecords: 1,
          })
          .firstPage();
        
        console.log('Found records:', records)
        return new Response(
          JSON.stringify({ record: records[0] || null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'create':
        console.log('Creating new user:', data)
        const createdRecords = await base('Users').create([
          {
            fields: {
              'First Name': data.firstName,
              'Last Name': data.lastName,
              Mobile: mobile,
            },
          },
        ]);
        
        console.log('Created record:', createdRecords[0])
        return new Response(
          JSON.stringify({ record: createdRecords[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'updateAddress':
        console.log('Updating user address:', { mobile, data })
        const userRecords = await base('Users')
          .select({
            filterByFormula: `{Mobile}='${mobile}'`,
            maxRecords: 1,
          })
          .firstPage();

        if (userRecords.length > 0) {
          const updatedRecord = await base('Users').update(userRecords[0].id, {
            'Street Address': data.streetAddress,
            'City': data.city,
            'State': data.state,
            'Zip Code': data.zipCode,
          });
          
          console.log('Updated record:', updatedRecord)
          return new Response(
            JSON.stringify({ record: updatedRecord }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        throw new Error('User not found')

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