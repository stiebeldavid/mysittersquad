import { createClient } from '@supabase/supabase-js'
import Airtable from 'airtable';

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
    console.log('Processing babysitter request:', { action, data })

    switch (action) {
      case 'fetch':
        const records = await base('Babysitters')
          .select({
            filterByFormula: `AND({Parent Owner Mobile}='${data.parentMobile}', {Deleted}!=1)`,
          })
          .all();

        const babysitters = records.map((record) => ({
          id: record.id,
          firstName: record.get('First Name'),
          lastName: record.get('Last Name'),
          mobile: record.get('Mobile'),
          age: record.get('Age'),
          grade: record.get('Grade'),
          rate: record.get('Hourly rate (USD)'),
          specialties: record.get('Specialties'),
          notes: record.get('Notes'),
          email: record.get('Email'),
        }));
        
        return new Response(
          JSON.stringify({ babysitters }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'create':
        const createdRecords = await base('Babysitters').create([
          {
            fields: {
              'First Name': data.firstName,
              'Last Name': data.lastName || '',
              'Mobile': data.mobile,
              'Parent Owner Mobile': data.parentMobile,
              'Age': data.age || '',
              'Grade': data.grade || '',
              'Hourly rate (USD)': data.rate || '',
              'Specialties': data.specialties || '',
              'Notes': data.notes || '',
              'Email': data.email || '',
              'Deleted': false,
            },
          },
        ]);
        
        return new Response(
          JSON.stringify({ record: createdRecords[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update':
        const updatedRecord = await base('Babysitters').update(data.id, {
          'First Name': data.firstName,
          'Last Name': data.lastName || '',
          'Mobile': data.mobile,
          'Age': data.age || '',
          'Grade': data.grade || '',
          'Hourly rate (USD)': data.rate || '',
          'Specialties': data.specialties || '',
          'Notes': data.notes || '',
          'Email': data.email || '',
        });
        
        return new Response(
          JSON.stringify({ record: updatedRecord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'delete':
        const deletedRecord = await base('Babysitters').update(data.id, {
          'Deleted': true
        });
        
        return new Response(
          JSON.stringify({ record: deletedRecord }),
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