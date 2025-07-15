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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => toast('🧠 Plagiarism check feature coming soon')}
            >
                🧠 Check Plagiarism
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
    </div>
    </>
);
}
