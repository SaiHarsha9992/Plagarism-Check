import mongoose from 'mongoose';
import connectToDatabase from '@/app/utils/mongodb';

export async function POST(req) {
  const { codeId, name, email, code, language, timestamp } = await req.json();

  await connectToDatabase(); // Connect using mongoose

  // Define schema & model (dynamic schema allows flexibility)
  const submissionSchema = new mongoose.Schema({}, { strict: false });
  const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema, 'submissions');

  try {
    await Submission.create({
      codeId,
      name,
      email,
      code,
      language,
      timestamp,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('❌ Insert failed:', err);
    return new Response(JSON.stringify({ error: 'Failed to insert submission' }), { status: 500 });
  }
}
