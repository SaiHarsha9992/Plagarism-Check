// app/api/get-code/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/utils/mongodb';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const codeId = searchParams.get('codeId');

  if (!codeId) {
    return NextResponse.json({ error: 'Missing codeId' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();
    const results = await db
      .collection('submissions')
      .find({ codeId })
      .toArray(); // fetch all matching

    if (!results || results.length === 0) {
      return NextResponse.json({ error: 'No submissions found' }, { status: 404 });
    }

    return NextResponse.json(results); // return array of submissions
  } catch (err) {
    console.error('❌ MongoDB query failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
