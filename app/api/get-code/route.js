import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/utils/mongodb';
import mongoose from 'mongoose';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const codeId = searchParams.get('codeId');

  if (!codeId) {
    return NextResponse.json({ error: 'Missing codeId' }, { status: 400 });
  }

  try {
    await connectToDatabase(); // just initialize the connection

    // Define schema & model inline (or import from separate file)
    const submissionSchema = new mongoose.Schema({}, { strict: false });
    const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema, 'submissions');

    const results = await Submission.find({ codeId });

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error('❌ MongoDB query failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
