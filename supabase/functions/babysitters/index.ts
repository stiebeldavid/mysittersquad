import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, normalizePhoneNumber } from './config.ts';
import { 
  fetchBabysittersFromAirtable, 
  createBabysitterInAirtable,
  updateBabysitterInAirtable,
  deleteBabysitterFromAirtable
} from './airtable.ts';

serve(async (req) => {
  // Add detailed logging
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      }
    });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      throw new Error('Missing authorization header');
    }

    // Get request body
    const { action, data } = await req.json();
    console.log('Processing request:', { action, data });

    switch (action) {
      case 'fetch': {
        if (!data?.parentMobile) {
          console.error('Parent mobile number is required for fetch action');
          throw new Error('Parent mobile number is required for fetch action');
        }

        const normalizedMobile = normalizePhoneNumber(data.parentMobile);
        console.log('Fetching babysitters for normalized parent mobile:', normalizedMobile);
        
        const babysitters = await fetchBabysittersFromAirtable(normalizedMobile);
        
        return new Response(
          JSON.stringify({ babysitters }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        if (!data?.firstName || !data?.mobile || !data?.parentMobile) {
          throw new Error('First name, mobile number, and parent mobile are required for create action');
        }

        console.log('Creating new babysitter:', data);
        const record = await createBabysitterInAirtable(data);
        
        return new Response(
          JSON.stringify({ record }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update': {
        if (!data?.id || !data?.firstName || !data?.mobile) {
          throw new Error('ID, first name, and mobile number are required for update action');
        }

        console.log('Updating babysitter:', data);
        const record = await updateBabysitterInAirtable(data.id, data);
        
        return new Response(
          JSON.stringify({ record }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'softDelete': { // Changed from 'delete' to 'softDelete'
        if (!data?.id) {
          throw new Error('ID is required for soft delete action');
        }

        console.log('Soft deleting babysitter:', data);
        const record = await deleteBabysitterFromAirtable(data.id);
        
        return new Response(
          JSON.stringify({ record }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});