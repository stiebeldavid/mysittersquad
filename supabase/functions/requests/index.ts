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

// Helper function to format time range
const formatTimeRange = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  
  const startHour12 = startHour % 12 || 12;
  const startPeriod = startHour >= 12 ? 'pm' : 'am';
  const formattedStart = `${startHour12}:${startMinute.toString().padStart(2, '0')}`;
  
  const endHour12 = endHour % 12 || 12;
  const endPeriod = endHour >= 12 ? 'pm' : 'am';
  const formattedEnd = `${endHour12}:${endMinute.toString().padStart(2, '0')}`;
  
  if (startPeriod === endPeriod) {
    return `${formattedStart}-${formattedEnd}${endPeriod}`;
  }
  
  return `${formattedStart}${startPeriod}-${formattedEnd}${endPeriod}`;
};

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
          babysitterId: record.get('Babysitter'),
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

        // Format the time range if start and end times are provided separately
        const formattedTimeRange = data.startTime && data.endTime 
          ? formatTimeRange(data.startTime, data.endTime)
          : data.timeRange;

        const records = await base(REQUESTS_TABLE).create([
          {
            fields: {
              'Request Date': data.requestDate,
              'Time Range': formattedTimeRange,
              'Babysitter': [data.babysitterId],
              'Parent Requestor Mobile': data.parentMobile,
              'Request Group ID': data.requestGroupId,
              'Status': 'Pending',
              'Additional Notes': data.notes || '',
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
            },
          },
        ])

        console.log('Updated request:', records[0])
        
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        )
      }

      case 'fetchByVerificationId': {
        if (!data?.verificationId) {
          throw new Error('Verification ID is required for fetchByVerificationId action')
        }

        console.log('Fetching request by verification ID:', data.verificationId)
        
        const records = await base(REQUESTS_TABLE)
          .select({
            filterByFormula: `{Verification ID}='${data.verificationId}'`,
            maxRecords: 1
          })
          .all()

        if (records.length === 0) {
          return new Response(
            JSON.stringify({ record: null }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
          )
        }

        const record = records[0]
        const requestDetails = {
          id: record.id,
          requestDate: record.get('Request Date'),
          timeRange: record.get('Time Range'),
          notes: record.get('Additional Notes'),
          date: record.get('Request Date'),
          babysitterFirstName: record.get('First Name (from Babysitter)'),
          parent: {
            firstName: record.get('Parent First Name'),
            lastName: record.get('Parent Last Name')
          },
          verificationId: record.get('Verification ID')
        }

        return new Response(
          JSON.stringify({ record: requestDetails }),
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
