export async function POST(req: Request) {
  const body = await req.json();
  console.log('C2B Validation Received:', body);

  // Optionally add validation logic here
  return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Validation accepted' }), {
    status: 200,
  });
}
