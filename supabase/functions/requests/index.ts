import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from './corsHeaders.ts';
import { fetchRequests } from './handlers/fetchRequests.ts';
import { createRequest } from './handlers/createRequest.ts';
import { updateResponse } from './handlers/updateResponse.ts';
import { fetchRequestByVerificationId } from './handlers/fetchRequestByVerificationId.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log('Processing request:', { action, data });

    switch (action) {
      case 'fetch': {
        if (!data?.parentMobile) {
          throw new Error('Parent mobile number is required for fetch action');
        }
        
        const requests = await fetchRequests(data.parentMobile);
        return new Response(
          JSON.stringify({ requests }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'create': {
        if (!data?.requestDate || !data?.timeRange || !data?.babysitterId || !data?.parentMobile || !data?.requestGroupId) {
          throw new Error('Missing required fields for create action');
        }

        const record = await createRequest(data);
        return new Response(
          JSON.stringify({ record }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'updateResponse': {
        if (!data?.requestId || !data?.status) {
          throw new Error('Request ID and status are required for updateResponse action');
        }

        const record = await updateResponse(data.requestId, data.status, data.response);
        return new Response(
          JSON.stringify({ record }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'fetchByVerificationId': {
        if (!data?.verificationId) {
          console.error('Missing verification ID');
          return new Response(
            JSON.stringify({ error: 'Verification ID is required' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const record = await fetchRequestByVerificationId(data.verificationId);
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
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});