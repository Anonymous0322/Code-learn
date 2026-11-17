import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!cronSecret || !supabaseUrl || !serviceRoleKey) {
    console.error('Account deletion cron is missing server environment variables.');
    return NextResponse.json({ error: 'Server configuration is incomplete.' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` };
  const pendingResponse = await fetch(
    `${supabaseUrl}/rest/v1/account_deletion_requests?select=user_id&delete_after=lte.${encodeURIComponent(new Date().toISOString())}`,
    { headers, cache: 'no-store' },
  );
  if (!pendingResponse.ok) {
    console.error('Could not load due account deletion requests.', await pendingResponse.text());
    return NextResponse.json({ error: 'Could not load pending requests.' }, { status: 502 });
  }

  const requests = await pendingResponse.json() as { user_id: string }[];
  const failures: string[] = [];
  let deleted = 0;
  for (const { user_id: userId } of requests) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users/${encodeURIComponent(userId)}`, {
      method: 'DELETE',
      headers,
      cache: 'no-store',
    });
    if (response.ok || response.status === 404) {
      deleted += 1;
    } else {
      failures.push(userId);
      console.error(`Account deletion failed for ${userId}.`, await response.text());
    }
  }
  if (failures.length) {
    return NextResponse.json({ deleted, failed: failures.length }, { status: 502 });
  }
  return NextResponse.json({ deleted });
}
