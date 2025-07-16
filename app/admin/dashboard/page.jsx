'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/NavBar';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [codeId, setCodeId] = useState('');
  const [codeList, setCodeList] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [plagiarisedList, setPlagiarisedList] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u?.email !== 'gaduharsha72@gmail.com') {
        router.push('/admin/login');
      }
    });
  }, [router]);

  const fetchCode = async () => {
    if (!codeId) return import('react-hot-toast').then(({ toast }) => {
                toast.error('Please enter a code ID');
            });;
    setLoading(true);
    try {
      const res = await fetch(`/api/get-code?codeId=${codeId}`);
      const data = await res.json();
      if (res.ok) {
        setCodeList(data);
        setSelectedCode(null);
      } else {
        import('react-hot-toast').then(({ toast }) => {
                toast.error(data.error || 'Failed to fetch code');
            });
        setCodeList([]);
      }
    } catch {
        import('react-hot-toast').then(({ toast }) => {
                toast.error('Something went wrong');
            });
      setCodeList([]);
    }
    setLoading(false);
  };
  const checkPlagiarism = async () => {
  if (!codeId) {
    toast.error('Enter a codeId to check for plagiarism');
    return;
  }

  setLoading(true);
  try {
    const res = await fetch('https://plagrisum-check-backend-1.onrender.com/submissions/check-all');
    const allResults = await res.json();

    const matching = allResults.filter(entry => entry.codeId === codeId);

    if (matching.length === 0) {
      toast.success('No plagiarism detected for this Code ID');
    } else {
      toast.success(`Plagiarism detected for ${matching.length} user(s)`);
    }

    setPlagiarisedList(matching); // 🔥 Save the results

    // Send emails to each user
    matching.forEach(async (entry) => {
  const count = entry.plagiarisedWith.length - 1; // exclude the person themself
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: entry.email,
      subject: `⚠️ Plagiarism Detected - Code ID: ${entry.codeId}`,
      message: `Hi ${entry.name},\n\nWe have reviewed the code submissions under Code ID "${entry.codeId}" and identified your submission as potentially plagiarised.\n\n🚨 Your code appears to closely match with ${count} other submission(s), indicating possible code duplication or unauthorized sharing.\n\nIf you believe this is a mistake or have a valid explanation, please reach out to the administrator immediately with supporting details.\n\nIt’s important that all participants uphold academic and ethical integrity.\n\nThank you for your cooperation.\n\n- Plagiarism Check Team`
    }),
  });
});


  } catch (err) {
    toast.error('Failed to check plagiarism');
    console.error(err);
  }
  setLoading(false);
};



return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <Navbar/>
    <div className="p-6 max-w-7xl mx-auto bg-gradient-to-br from-gray-900 to-blue-900">
        <h2 className="text-2xl font-bold mb-4">🔐 Admin Dashboard</h2>

        <div className="mb-6 flex flex-col md:flex-row gap-3">
            <input
                type="text"
                value={codeId}
                onChange={(e) => setCodeId(e.target.value)}
                className="flex-1 p-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
                placeholder="Enter Code ID to list submissions"
            />
            <button
                onClick={fetchCode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
                {loading ? 'Fetching...' : 'Get Submissions'}
            </button>
            <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={checkPlagiarism}
                disabled={loading}
                >
                {loading ? 'Checking...' : '🧠 Check Plagiarism'}
            </button>


        </div>

        {/* List of matching submissions */}
        {codeList.length > 0 && !selectedCode && (
            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">📋 Matching Submissions ({codeList.length})</h3>
                <ul className="space-y-2">
                    {codeList.map((submission, index) => (
                        <li
                            key={index}
                            onClick={() => setSelectedCode(submission)}
                            className="cursor-pointer bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 border p-3 rounded"
                        >
                            {submission.name} ({new Date(submission.timestamp).toLocaleString()})
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Single code detail view */}
        {selectedCode && (
            <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded shadow-md">
                <button
                    className="mb-3 text-sm text-blue-600 underline"
                    onClick={() => setSelectedCode(null)}
                >
                    ← Back to List
                </button>
                <h3 className="text-xl font-semibold mb-2">Submission Details</h3>
                <p><b>Code ID:</b> {selectedCode.codeId}</p>
                <p><b>Name:</b> {selectedCode.name}</p>
                <p><b>Email:</b> {selectedCode.email}</p>
                <p><b>Language:</b> {selectedCode.language}</p>
                <p><b>Timestamp:</b> {new Date(selectedCode.timestamp).toLocaleString()}</p>
                <div className="mt-4">
                    <h4 className="font-semibold mb-1">Submitted Code:</h4>
                    <pre className="bg-black text-green-200 p-3 rounded overflow-auto whitespace-pre-wrap max-h-[400px]">
                        {selectedCode.code}
                    </pre>
                </div>
            </div>
        )}
        {plagiarisedList.length > 0 && (
  <div className="mt-10 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold mb-4 text-red-500">🚨 Plagiarism Detected</h3>
    {plagiarisedList.map((entry, i) => (
      <div key={i} className="mb-6 border border-red-400 p-4 rounded bg-red-50 dark:bg-red-900">
        <p><b>Name:</b> {entry.name}</p>
        <p><b>Email:</b> {entry.email}</p>
        <p><b>Code ID:</b> {entry.codeId}</p>
        <p className="mt-2 font-semibold">⚠️ Plagiarised With:</p>
        <ul className="list-disc list-inside ml-4">
          {entry.plagiarisedWith.map((p, idx) => (
            <li key={idx}>
              {p.name} ({p.email})
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
)}

    </div>
    </>
);
}
