import Airtable from 'npm:airtable';

Airtable.configure({
  apiKey: Deno.env.get('AIRTABLE_API_KEY'),
});

export const base = Airtable.base('appbQPN6CeEmayzz1');
export const REQUESTS_TABLE = 'tblz6LOxHesVWmmYI';
export const USERS_TABLE = 'tblV7kcHyLgVt9QHZ';