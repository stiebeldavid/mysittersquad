import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js';
import Airtable from 'npm:airtable';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY');
    if (!AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY is required');
    }

    Airtable.configure({
      apiKey: AIRTABLE_API_KEY,
    });

    const base = Airtable.base('appbQPN6CeEmayzz1');
    const { action, data } = await req.json();
    console.log('Processing babysitter request:', { action, data });

    switch (action) {
      case 'fetch': {
        if (!data?.parentMobile) {
          throw new Error('Parent mobile number is required for fetch action');
        }
        console.log('Fetching babysitters for parent:', data.parentMobile);
        
        const records = await base('tblpKMKxnmPHj0pRs')
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
        
        console.log(`Found ${babysitters.length} babysitters`);
        return new Response(
          JSON.stringify({ babysitters }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        if (!data?.firstName || !data?.mobile || !data?.parentMobile) {
          throw new Error('First name, mobile, and parent mobile are required for create action');
        }
        console.log('Creating new babysitter:', data);
        
        const createdRecords = await base('tblpKMKxnmPHj0pRs').create([
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
        
        console.log('Created babysitter record:', createdRecords[0]);
        return new Response(
          JSON.stringify({ record: createdRecords[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        if (!data?.id || !data?.firstName || !data?.mobile) {
          throw new Error('ID, first name, and mobile are required for update action');
        }
        console.log('Updating babysitter:', data);
        
        const updatedRecord = await base('tblpKMKxnmPHj0pRs').update(data.id, {
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
        
        console.log('Updated babysitter record:', updatedRecord);
        return new Response(
          JSON.stringify({ record: updatedRecord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        if (!data?.id) {
          throw new Error('Babysitter ID is required for delete action');
        }
        console.log('Soft deleting babysitter:', data.id);
        
        const deletedRecord = await base('tblpKMKxnmPHj0pRs').update(data.id, {
          'Deleted': true
        });
        
        console.log('Soft deleted babysitter record:', deletedRecord);
        return new Response(
          JSON.stringify({ record: deletedRecord }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});