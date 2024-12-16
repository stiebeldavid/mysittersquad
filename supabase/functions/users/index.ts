import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'npm:@supabase/supabase-js';
import Airtable from 'npm:airtable';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    const { mobile, action, data } = await req.json();
    console.log('Processing request:', { action, mobile, data });

    if (!action) {
      throw new Error('Action is required');
    }

    switch (action) {
      case 'findByMobile': {
        if (!mobile) {
          throw new Error('Mobile number is required for findByMobile action');
        }
        console.log('Looking up user by mobile:', mobile);
        
        const records = await base('tblV7kcHyLgVt9QHZ')
          .select({
            filterByFormula: `{Mobile}='${mobile}'`,
            maxRecords: 1,
          })
          .firstPage();
        
        console.log('Found records:', records);
        return new Response(
          JSON.stringify({ record: records[0] || null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        if (!mobile || !data?.firstName || !data?.lastName) {
          throw new Error('Mobile, firstName, and lastName are required for create action');
        }
        console.log('Creating new user:', { mobile, ...data });
        
        const records = await base('tblV7kcHyLgVt9QHZ').create([
          {
            fields: {
              'First Name': data.firstName,
              'Last Name': data.lastName,
              'Mobile': mobile,
            },
          },
        ]);
        
        console.log('Created record:', records[0]);
        return new Response(
          JSON.stringify({ record: records[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'updateAddress': {
        if (!mobile || !data?.streetAddress || !data?.city || !data?.state || !data?.zipCode) {
          throw new Error('Mobile and all address fields are required for updateAddress action');
        }
        console.log('Updating user address:', { mobile, ...data });
        
        // First find the record
        const records = await base('tblV7kcHyLgVt9QHZ')
          .select({
            filterByFormula: `{Mobile}='${mobile}'`,
            maxRecords: 1,
          })
          .firstPage();
        
        if (records.length === 0) {
          throw new Error('User not found');
        }

        // Update the record
        const updatedRecords = await base('tblV7kcHyLgVt9QHZ').update([
          {
            id: records[0].id,
            fields: {
              'Street Address': data.streetAddress,
              'City': data.city,
              'State': data.state,
              'Zip Code': data.zipCode,
            },
          },
        ]);
        
        console.log('Updated record:', updatedRecords[0]);
        return new Response(
          JSON.stringify({ record: updatedRecords[0] }),
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