'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../components/NavBar';
import { useRouter } from 'next/navigation';
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const PROBLEM = {
  title: 'Sum of Two Numbers',
  statement: 'Given two integers, output their sum.',
  testCases: [
    { input: '2 3', expected: '5' },
    { input: '10 20', expected: '30' },
  ],
};

const LANGUAGE_OPTIONS = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];

const DEFAULT_CODE = {
  cpp: `// Write your C++ code here
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
  java: `// Write your Java code here
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
  python: `# Write your Python code here
a, b = map(int, input().split())
print(a + b)`,
};

export default function SubmitPage() {
    const router = useRouter();
  const [code, setCode] = useState(DEFAULT_CODE.cpp);
  const [language, setLanguage] = useState('cpp');
  const [user, setUser] = useState(null);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [meta, setMeta] = useState(null);
  const [metaForm, setMetaForm] = useState({ codeId: '', name: '', email: '' });

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (!u) window.location.href = '/login';
      else setUser(u);
    });

    const saved = {
      codeId: localStorage.getItem('codeId'),
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
    };
    if (saved.codeId && saved.name && saved.email) {
      setMeta(saved);
    }
  }, []);

  const handleMetaSubmit = () => {
    if (!metaForm.codeId || !metaForm.name || !metaForm.email) return import('react-hot-toast').then(({ toast }) => {
                toast.error("Fill all fields");
            });
    localStorage.setItem('codeId', metaForm.codeId);
    localStorage.setItem('name', metaForm.name);
    localStorage.setItem('email', metaForm.email);
    setMeta(metaForm);
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput('');
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput('Running...');
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, testCases: PROBLEM.testCases }),
      });
      const data = await res.json();
      if (data.success) {
        const formatted = data.results.map((r, i) => (
          `Test Case ${i + 1}:\nInput: ${r.input}\nExpected: ${r.expected}\nActual: ${r.actual}\nResult: ${r.correct ? '✅ Passed' : '❌ Failed'}\n`
        )).join('\n');
        setOutput(formatted);
      } else {
        setOutput('Error: ' + data.error);
      }
    } catch (err) {
      setOutput('Error running code');
    }
    setRunning(false);
  };

 const handleSubmit = async () => {
  if (!meta) {
    import('react-hot-toast').then(({ toast }) => toast.error("Missing user info, Re-enter details"));
    return;
  }

  await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codeId: meta.codeId,
      name: meta.name,
      email: meta.email,
      code,
      language,
      timestamp: new Date().toISOString()
    }),
  });

  // Clear codeId from localStorage after submission
  localStorage.removeItem('codeId');
  setMeta(null); // Force re-ask for codeId if user returns

  import('react-hot-toast').then(({ toast }) => toast.success('Submission successful'));
  router.push(`/results?codeId=${meta.codeId}`);
};


  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  if (!meta) {
    return (
      <>
      
        <Navbar />
      <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className={`p-8 max-w-md w-full border rounded-lg ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} shadow-lg border-gray-800`}>
          <div className="flex justify-end mb-2">
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Enter Your Submission Details</h2>
          <input
            placeholder="Code ID"
            value={metaForm.codeId}
            onChange={(e) => setMetaForm({ ...metaForm, codeId: e.target.value })}
            className="mb-4 w-full p-3 border rounded bg-white text-black dark:bg-black dark:text-white border-gray-800"
          />
          <input
            placeholder="Name"
            value={metaForm.name}
            onChange={(e) => setMetaForm({ ...metaForm, name: e.target.value })}
            className="mb-4 w-full p-3 border rounded bg-white text-black dark:bg-black dark:text-white border-gray-800"
          />
          <input
            placeholder="Email"
            type="email"
            value={metaForm.email}
            onChange={(e) => setMetaForm({ ...metaForm, email: e.target.value })}
            className="mb-6 w-full p-3 border rounded bg-white text-black dark:bg-black dark:text-white border-gray-800"
          />
          <button
            className="bg-black text-white hover:bg-gray-800 transition px-4 py-2 rounded w-full font-semibold border border-gray-800"
            onClick={handleMetaSubmit}
          >
            Start Coding
          </button>
        </div>
      </div>
      </>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
        <Navbar />
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'} py-8`}>
            <div className={`max-w-6xl mx-auto rounded-xl shadow-lg p-8 grid md:grid-cols-2 gap-10
                ${theme === 'dark' ? 'bg-black text-white border border-gray-800' : 'bg-white text-black border border-gray-800'}`}>
                {/* Left: Problem */}
                <div className="space-y-6">
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>{PROBLEM.title}</h2>
                    <div>
                        <h4 className="font-semibold mb-1">Problem Statement</h4>
                        <div className={`p-3 rounded ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50 border border-blue-100'}`}>{PROBLEM.statement}</div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-1">Test Cases</h4>
                        <ul className="list-disc ml-5 space-y-2 text-sm">
                            {PROBLEM.testCases.map((tc, i) => (
                                <li key={i}>
                                    <b>Input:</b> {tc.input} | <b>Expected:</b> {tc.expected}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Code Editor & Controls */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold">Language:</label>
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="border rounded px-3 py-1 dark:bg-gray-900 dark:text-white bg-white text-gray-900"
                        >
                            {LANGUAGE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <button
                            onClick={toggleTheme}
                            className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            {theme === 'dark' ? '☀ Light' : '🌙 Dark'}
                        </button>
                    </div>

                    <div className={`rounded-lg overflow-hidden border-2 shadow
                        ${theme === 'dark' ? 'border-blue-800' : 'border-blue-200'}`}>
                        <MonacoEditor
                            height="400px"
                            language={language}
                            value={code}
                            onChange={(v) => setCode(v || '')}
                            theme={theme === 'dark' ? 'vs-dark' : 'light'}
                            options={{
                                fontSize: 16,
                                minimap: { enabled: false },
                                fontFamily: 'Fira Mono, monospace',
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold shadow ${running ? 'opacity-60 cursor-not-allowed' : ''}`}
                            onClick={handleRun}
                            disabled={running}
                        >
                            {running ? 'Running...' : 'Run'}
                        </button>
                        <button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>

                    <div>
                        <div className="font-semibold mb-1">Output:</div>
                        <pre className={`p-3 rounded-lg min-h-[80px] text-sm overflow-x-auto whitespace-pre-wrap
                            ${theme === 'dark'
                                ? 'bg-black dark:bg-gray-900 text-green-200'
                                : 'bg-gray-100 text-green-700 border border-gray-200'
                            }`}>
                            {output}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

}
