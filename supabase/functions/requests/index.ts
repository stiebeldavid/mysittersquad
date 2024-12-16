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
    console.log('Processing request:', { action, data })

    switch (action) {
      case 'fetch':
        const records = await base('Requests')
          .select({
            filterByFormula: `{Parent Requestor Mobile}='${data.parentMobile}'`,
            sort: [{ field: 'Created Time', direction: 'desc' }],
          })
          .all();

        const requests = records.map((record) => ({
          id: record.id,
          date: record.get('Request Date'),
          timeRange: record.get('Time Range'),
          babysitterId: Array.isArray(record.get('Babysitter')) 
            ? record.get('Babysitter')[0] 
            : '',
          babysitterName: `${record.get('First Name (from Babysitter)')} ${record.get('Last Name (from Babysitter)')}`,
          status: record.get('Status') || 'Pending',
          createdAt: record.get('Created Time') || new Date().toISOString(),
          babysitterDeleted: record.get('Deleted (from Babysitter)') || false,
          notes: record.get('Additional Notes') || '',
        }));
        
        return new Response(
          JSON.stringify({ requests }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'create':
        const createdRecord = await base('Requests').create([
          {
            fields: {
              'Request Date': data.date,
              'Time Range': data.timeRange,
              'Babysitter': [data.babysitterId],
              'Parent Requestor Mobile': data.parentMobile,
              'Status': 'Pending',
              'Request Group ID': data.requestGroupId,
              'Additional Notes': data.notes || '',
            },
          },
        ]);
        
        return new Response(
          JSON.stringify({ record: createdRecord[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'updateResponse':
        const updatedRecord = await base('Requests').update(data.requestId, {
          'Status': data.status,
          'Babysitter Response': data.response,
        });
        
        return new Response(
          JSON.stringify({ record: updatedRecord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'fetchByVerificationId':
        const requestRecords = await base('Requests')
          .select({
            filterByFormula: `{Verification_ID}='${data.verificationId}'`,
            maxRecords: 1,
          })
          .firstPage();
        
        if (requestRecords.length === 0) {
          return new Response(
            JSON.stringify({ record: null }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const record = requestRecords[0];
        const parentMobile = record.get('Parent Requestor Mobile');
        
        const parentRecords = await base('Users')
          .select({
            filterByFormula: `{Mobile}='${parentMobile}'`,
            maxRecords: 1,
          })
          .firstPage();

        const parent = parentRecords.length > 0 ? {
          firstName: parentRecords[0].get('First Name'),
          lastName: parentRecords[0].get('Last Name'),
        } : null;

        const requestDetails = {
          id: record.id,
          date: record.get('Request Date'),
          timeRange: record.get('Time Range'),
          notes: record.get('Additional Notes'),
          babysitterFirstName: record.get('First Name (from Babysitter)'),
          parent,
          verificationId: data.verificationId,
        };
        
        return new Response(
          JSON.stringify({ record: requestDetails }),
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