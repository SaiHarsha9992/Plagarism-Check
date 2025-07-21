'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import Split from 'react-split';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { QUESTION_POOL } from '@/app/utils/questions';
import Navbar from '../components/NavBar';
import toast, { Toaster } from 'react-hot-toast';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
];

const DEFAULT_CODE = {
  cpp: `#include<iostream>\nusing namespace std;\n\nint main() {\n  // Your code here\n  return 0;\n}`,
  java: `public class Main {\n  public static void main(String[] args) {\n    // Your code here\n  }\n}`,
  python: `# Your code here\ndef main():\n  pass\n\nmain()`,
};

export default function SubmitPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [answers, setAnswers] = useState({});
  const [langs, setLangs] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [meta, setMeta] = useState({ codeId: '', name: '', email: '' });
  const [started, setStarted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [output, setOutput] = useState({});
  const [outputTab, setOutputTab] = useState(0);
  const [submittedCodes, setSubmittedCodes] = useState([]);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [browserCompatible, setBrowserCompatible] = useState(true);
  const [copyPasteCount, setCopyPasteCount] = useState(0);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => { if (!user) router.push('/login'); });

    const picked = [...QUESTION_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
    setQuestions(picked);

    const initL = {}, initA = {};
    for (const q of picked) {
      initL[q.id] = 'cpp';
      initA[q.id] = DEFAULT_CODE.cpp;
    }
    setLangs(initL);
    setAnswers(initA);
  }, []);

  // ---- Browser Compatibility Check ----
  const isBrowserCompatible = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('chrome') &&  !ua.includes('opr');
  };
useEffect(() => {
  const onVisibilityChange = () => {
    if (started && document.visibilityState === 'hidden') {
      toast.error('❌ You switched tabs or minimized — test failed.');
      fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeId: meta.codeId,
          name: meta.name,
          email: meta.email,
          submissions: [],
          timestamp: new Date().toISOString(),
          forcedFail: true,
        }),
      });
      setTimeout(() => router.push('/failed'), 2000);
    }
  };

  document.addEventListener('visibilitychange', onVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}, [started, meta, router]);
useEffect(() => {
  const handleCopyPaste = (e) => {
    if (!started) return;

    e.preventDefault(); // block copy/paste action
    setCopyPasteCount(prev => {
      const next = prev + 1;

      if (next < 3) {
        toast.error('⚠️ Copy/Paste is not allowed.');
      } else {
        toast.error('❌ You violated copy/paste rules 3 times. Test failed.');
        fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            codeId: meta.codeId,
            name: meta.name,
            email: meta.email,
            submissions: [],
            timestamp: new Date().toISOString(),
            forcedFail: true,
          }),
        });
        setTimeout(() => router.push('/failed'), 2000);
      }

      return next;
    });
  };

  document.addEventListener('copy', handleCopyPaste);
  document.addEventListener('cut', handleCopyPaste);
  document.addEventListener('paste', handleCopyPaste);

  return () => {
    document.removeEventListener('copy', handleCopyPaste);
    document.removeEventListener('cut', handleCopyPaste);
    document.removeEventListener('paste', handleCopyPaste);
  };
}, [started, meta, router]);


 useEffect(() => {
  const onFullscreenChange = () => {
    const isFullscreen = !!document.fullscreenElement;
if (isFullscreen) {
  setFullscreenWarning(false); // auto-clear warning if user goes back to fullscreen
}
    if (started && !isFullscreen) {
      setFullscreenExitCount(prev => {
        const next = prev + 1;

        if (next < 3) {
          toast.error(`⚠️ You exited fullscreen (${next}/3). Please stay in fullscreen.`);

          // Don't call fullscreen re-entry here — browser won't allow it!
          setFullscreenWarning(true);
        } else {
          toast.error('❌ You exited fullscreen 3 times. Submitting...');
          fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              codeId: meta.codeId,
              name: meta.name,
              email: meta.email,
              submissions: [],
              timestamp: new Date().toISOString(),
              forcedFail: true,
            }),
          });

          setTimeout(() => router.push('/failed'), 2000);
        }

        return next;
      });
    }
  };

  document.addEventListener('fullscreenchange', onFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
}, [started, meta, router]);

  const getJudge0LangId = (lang) => ({ cpp: 54, java: 62, python: 71 })[lang];

  const handleMetaSubmit = () => {
    if (!meta.codeId || !meta.name || !meta.email) {
      toast.error('Please fill all fields');
      return;
    }
    if (!isBrowserCompatible()) {
      toast.error('Please use Google Chrome for this test.');
      setBrowserCompatible(false);
      return;
    }
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    setStarted(true);
  };

  const handleRunCode = async (question) => {
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          code: answers[question.id],
          language: langs[question.id],
          testCases: [{ input: question.input || question.sampleInput, expected: question.sampleOutput }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        const text = data.results.map(r => r.actual).join('\n');
        setOutput(prev => ({ ...prev, [question.id]: text }));
      } else toast.error('Execution failed');
    } catch { toast.error('Error running code'); }
  };

  const runHiddenTests = async (language_id, source_code, hiddenTests) => {
    const results = [];
    for (const test of hiddenTests) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const resp = await fetch('/api/judge0', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({ source_code, language_id, stdin: test.input }),
        });
        const d = await resp.json();
        const actual = (d.stdout || '').trim();
        const expected = (test.expected || '').trim();
        results.push({ input: test.input, expected, actual, correct: actual === expected });
      } catch {
        results.push({ input: test.input, expected: test.expected, actual: 'Error', correct: false });
      }
    }
    return results;
  };

  const handleSubmit = async (q) => {
    const code = answers[q.id], lang = langs[q.id], lid = getJudge0LangId(lang);
    const testResults = await runHiddenTests(lid, code, q.hiddenTests);
    const passedAll = testResults.every(t => t.correct);
    if (passedAll) {
      toast.success(`✅ ${q.title} passed all tests`);
      setSubmitted(prev => ({ ...prev, [q.id]: true }));
      setSubmittedCodes(prev => prev.some(p => p.questionId === q.id)
        ? prev
        : [...prev, { questionId: q.id, title: q.title, code, language: lang, plagiarism: q.plagiarism }]);
    } else toast.error(`❌ ${q.title} failed some tests`);
  };

  const handleFinalSubmit = async () => {
    if (submittedCodes.length !== 3) {
      toast.error('Submit all 3 before finishing.');
      return;
    }
    const payload = {
      codeId: meta.codeId,
      name: meta.name,
      email: meta.email,
      submissions: submittedCodes,
      timestamp: new Date().toISOString(),
    };
    try {
      const r = await fetch('/api/submit', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      toast[j.success ? 'success' : 'error'](j.success ? '✅ Final submission successful!' : '❌ Submission failed.');
    } catch (err) {
      console.error(err);
      toast.error('❌ Network error while submitting.');
    }
  };

  const current = questions[activeTab];

  // ---- Browser Incompat UI ----
  if (!started && !browserCompatible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-red-800 p-6 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl mb-4">Browser Incompatible</h2>
          <p>Please use <strong>Google Chrome</strong> to take the test.</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Enter Submission Details</h2>
          {['codeId','name','email'].map(field => (
            <input key={field} placeholder={field.toUpperCase()}
              className="mb-4 w-full px-3 py-2 rounded bg-gray-700"
              onChange={e => setMeta({ ...meta, [field]: e.target.value })}
            />
          ))}
          <button className="bg-blue-600 w-full py-2 rounded" onClick={handleMetaSubmit}>
            Start Coding
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar />
      <Toaster />
      {fullscreenWarning && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-md">
      <h2 className="text-xl mb-4 font-semibold">⚠️ Fullscreen Mode Required</h2>
      <p className="mb-4">
        You exited fullscreen mode. Please return to fullscreen to continue the test.
      </p>
      <button
        className="bg-blue-600 px-4 py-2 rounded"
        onClick={() => {
          document.documentElement.requestFullscreen()
            .then(() => setFullscreenWarning(false))
            .catch(err => {
              console.error('Failed to re-enter fullscreen:', err);
              toast.error('Browser blocked fullscreen. Please allow it.');
            });
        }}
      >
        Re-enter Fullscreen
      </button>
    </div>
  </div>
)}


      <div className="bg-gray-900 text-white min-h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                className={`px-4 py-2 rounded ${i === activeTab ? 'bg-blue-600' : 'bg-gray-700'}`}
                onClick={() => setActiveTab(i)}
              >
                Q-{i + 1} {submitted[q.id] ? '✅' : ''}
              </button>
            ))}
          </div>
          <button
            className="text-sm px-4 py-1 bg-gray-700 rounded"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <Split className="flex h-[80vh]" minSize={300} gutterSize={10}>
          <div className="bg-gray-800 p-6 rounded overflow-auto">
            <h2 className="text-xl font-bold mb-2">{current.title}</h2>
            <p className="mb-4">{current.description}</p>
            <div className="mb-2">
              <p className="text-sm text-gray-300">Sample Input:</p>
              <pre className="bg-gray-700 p-2 rounded">{current.sampleInput}</pre>
            </div>
            <div>
              <p className="text-sm text-gray-300">Sample Output:</p>
              <pre className="bg-gray-700 p-2 rounded">{current.sampleOutput}</pre>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded flex flex-col">
            <div className="flex justify-between mb-2">
              <select
                className="bg-gray-700 text-white p-2 rounded"
                value={langs[current.id]}
                onChange={(e) => {
                  const lang = e.target.value;
                  setLangs({ ...langs, [current.id]: lang });
                  setAnswers({ ...answers, [current.id]: DEFAULT_CODE[lang] });
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

           <MonacoEditor
  height="40%"
  language={langs[current.id]}
  theme={darkMode ? 'vs-dark' : 'light'}
  value={answers[current.id]}
  onChange={(val) => setAnswers({ ...answers, [current.id]: val || '' })}
  options={{ fontSize: 16, minimap: { enabled: false }, wordWrap: 'on' }}
  onMount={(editor, monaco) => {
    editor.onDidPaste(() => {
      toast.error("⚠️ Paste detected inside the editor. Not allowed.");
      setCopyPasteCount(prev => {
        const next = prev + 1;
        if (next >= 3) {
          toast.error('❌ You violated copy/paste rules 3 times. Test failed.');
          fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              codeId: meta.codeId,
              name: meta.name,
              email: meta.email,
              submissions: [],
              timestamp: new Date().toISOString(),
              forcedFail: true,
            }),
          });
          setTimeout(() => router.push('/failed'), 2000);
        }
        return next;
      });
    });

    // Optional: detect copy or cut inside the editor
    editor.onKeyDown((e) => {
      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyC' || e.code === 'KeyX')) {
        toast.error("⚠️ Copy/Cut detected inside the editor. Not allowed.");
        setCopyPasteCount(prev => {
          const next = prev + 1;
          if (next >= 3) {
            toast.error('❌ You violated copy/paste rules 3 times. Test failed.');
            fetch('/api/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                codeId: meta.codeId,
                name: meta.name,
                email: meta.email,
                submissions: [],
                timestamp: new Date().toISOString(),
                forcedFail: true,
              }),
            });
            setTimeout(() => router.push('/failed'), 2000);
          }
          return next;
        });
      }
    });
  }}
/>


            <div className="flex gap-4 mt-4">
              <button className="bg-blue-600 py-2 px-4 rounded" onClick={() => handleRunCode(current)}>Run</button>
              <button
                className={`bg-green-600 py-2 px-4 rounded ${submitted[current.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={submitted[current.id]}
                onClick={() => handleSubmit(current)}
              >
                {submitted[current.id] ? `Submitted ✅` : 'Submit'}
              </button>
            </div>

            <div className="mt-6">
              <div className="flex border-b border-gray-600">
                {['Custom Input', 'Code Output'].map((t, i) => (
                  <button
                    key={t}
                    className={`px-4 py-2 -mb-px ${i === outputTab ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400'}`}
                    onClick={() => setOutputTab(i)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="mt-2 h-32 overflow-auto bg-gray-900 p-3 rounded">
                {outputTab === 0 ? (
                  <textarea
                    className="w-full p-2 mt-4 rounded bg-gray-700 text-white"
                    rows={3}
                    placeholder="Custom input..."
                    value={current.input || ''}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[activeTab].input = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                ) : (
                  <pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap">
                    {output[current.id] || '— run code to see output —'}
                  </pre>
                )}
              </div>

              <button
                className="bg-purple-600 mt-4 px-4 py-2 rounded text-white"
                onClick={handleFinalSubmit}
              >
                Finish Test
              </button>
            </div>
          </div>
        </Split>
      </div>
    </div>
  );
}
