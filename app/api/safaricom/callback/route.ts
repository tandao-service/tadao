export async function POST(req: Request) {
  const body = await req.json();
  console.log('STKPUSH  Received:', body);

  // Optionally add validation logic here
  return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'STKPUSH accepted' }), {
    status: 200,
  });
}
