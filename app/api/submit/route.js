import mongoose from 'mongoose';
import connectToDatabase from '@/app/utils/mongodb';

export async function POST(req) {
  const { codeId, name, email, submissions, timestamp, forcedFail } = await req.json();

  await connectToDatabase();

  const schema = new mongoose.Schema({}, { strict: false });
  const Submission = mongoose.models.Submission || mongoose.model('Submission', schema, 'submissions');

  try {
    await Submission.create({
      codeId,
      name,
      email,
      submissions,
      timestamp,
      forcedFail,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('❌ Insert failed:', err);
    return new Response(JSON.stringify({ error: 'Failed to insert submission' }), { status: 500 });
  }
}
