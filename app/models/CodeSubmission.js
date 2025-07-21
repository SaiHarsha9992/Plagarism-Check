import mongoose from 'mongoose';

const CodeSubmissionSchema = new mongoose.Schema({
  codeId: { type: String, required: true },
  name: String,
  email: String,
  code: String,
  language: String,
  plagiarism: Number,
  timestamp: Date,
});

export default mongoose.models.CodeSubmission ||
  mongoose.model('CodeSubmission', CodeSubmissionSchema);
