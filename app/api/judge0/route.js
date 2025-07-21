// app/api/judge0/route.js

export async function POST(req) {
  const body = await req.json();
  const { source_code, language_id, stdin } = body;

  if (!source_code || !language_id) {
    return new Response(JSON.stringify({ message: 'Missing source_code or language_id' }), {
      status: 400,
    });
  }

  try {
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, // ✅ Ensure this is set in your .env
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: 'Execution failed', error: data }), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('❌ Judge0 Error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), {
      status: 500,
    });
  }
}
