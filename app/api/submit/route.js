import connectToDatabase from '@/app/utils/mongodb';

export async function POST(req) {
    const { codeId, name, email, code, language, timestamp } = await req.json();

    const { db } = await connectToDatabase();
    await db.collection('submissions').insertOne({
        codeId,
        name,
        email,
        code,
        language,
        timestamp,
    });

    return new Response(JSON.stringify({ success: true }), { status:200 });
}
