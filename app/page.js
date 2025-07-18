
import Navbar from './components/NavBar';

const symbols = [
  '{', '}', '()', '<>', 'JS', 'Py', 'C++', 'Java', 'λ', '∑', '∫', 'ƒ', '→', '⇌', 'Σ', 'π', '∂', '≡', '≠', '&&', '||', '::', '=>', '/*', '*/', 'def', 'class', 'public', 'private', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally', 'new', 'const', 'let', 'var', 'true', 'false', 'null', 'undefined', 'NaN', 'async', 'await', 'static', 'void', 'main', 'print', 'cout', 'System.out.println', 'console.log', 'list', 'dict', 'map', 'set', 'tree', 'graph', 'node', 'edge', 'BFS', 'DFS', 'O(n)', 'O(1)', 'O(log n)', 'O(n^2)'
];

function ParallaxBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 20%, #222 60%, #000 100%)',
    }}>
      {/* Milky Way Stars */}
      {[...Array(120)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          borderRadius: '50%',
          background: 'white',
          opacity: Math.random() * 0.7 + 0.3,
          filter: 'blur(0.5px)',
          animation: `starMove ${10 + Math.random() * 20}s linear infinite`,
        }} />
      ))}
      {/* Floating Programming Symbols */}
      {symbols.slice(0, 40).map((sym, i) => (
        <span key={sym + i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 2 + 1.2}rem`,
          color: ['#fff', '#bbb', '#888'][i % 3],
          opacity: 0.15 + Math.random() * 0.25,
          fontWeight: 700,
          pointerEvents: 'none',
          animation: `floatSymbol ${12 + Math.random() * 18}s ease-in-out infinite`,
        }}>{sym}</span>
      ))}
      <style>{`
        @keyframes starMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        @keyframes floatSymbol {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ParallaxBackground />
      <Navbar />
      <main className="min-h-screen flex flex-col items-center justify-center bg-transparent text-white px-4">
        <section className="w-full max-w-2xl text-center py-20">
          <h1 style={{ fontFamily: 'Inter, Roboto, Montserrat, Arial, sans-serif', fontSize: '4rem', fontWeight: 900, letterSpacing: '-2px', marginBottom: '1.5rem', color: '#fff', textShadow: '0 2px 24px #000, 0 0 2px #fff' }}>
            <span style={{ letterSpacing: '0.05em', background: 'linear-gradient(90deg, #fff 60%, #bbb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CloneCatcher</span>
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#bbb', marginBottom: '2.5rem', fontWeight: 500, textShadow: '0 1px 8px #000' }}>
            Discover plagiarism in code with precision.<br />
            <span style={{ color: '#fff', fontWeight: 700 }}>Classic. Accurate. Professional.</span>
          </p>
          <a href="/login" className="btn" style={{ fontSize: '1.15rem', background: '#fff', color: '#111', padding: '0.9rem 2.5rem', borderRadius: '8px', fontWeight: 700, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'background 0.2s, color 0.2s' }}>
            Get Started
          </a>
        </section>
        <section className="w-full max-w-2xl text-center py-10" style={{ background: 'rgba(34,34,34,0.95)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.2rem', textShadow: '0 1px 8px #000' }}>Why <span style={{ color: '#fff', fontWeight: 900 }}>CloneCatcher</span>?</h2>
          <ul style={{ listStyle: 'none', padding: 0, color: '#ccc', fontSize: '1.15rem', fontWeight: 500 }}>
            <li style={{ marginBottom: '1rem' }}>• Lightning-fast code analysis</li>
            <li style={{ marginBottom: '1rem' }}>• Supports multiple languages</li>
            <li style={{ marginBottom: '1rem' }}>• Secure and private</li>
  
          </ul>
        </section>
      </main>
    </>
  );
}
