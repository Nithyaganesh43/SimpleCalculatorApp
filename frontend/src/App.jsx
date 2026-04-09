import { useMemo, useState } from 'react';
import './App.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api/calculate`;

function App() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => a.trim() !== '' && b.trim() !== '' && !loading, [a, b, loading]);

  const calculate = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b, operator }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Calculation failed.');
      }

      setResult(data.result);
    } catch (requestError) {
      setError(requestError.message || 'Unable to reach backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="calculator-card">
        <h1>Full Stack Calculator</h1>
        <p className="subtitle">Input and output in frontend, calculation in Express backend.</p>

        <form className="calculator-form" onSubmit={calculate}>
          <label>
            First Number
            <input
              type="number"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
              placeholder="Enter first number"
              required
            />
          </label>

          <label>
            Operator
            <select value={operator} onChange={(event) => setOperator(event.target.value)}>
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">*</option>
              <option value="/">/</option>
            </select>
          </label>

          <label>
            Second Number
            <input
              type="number"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
              placeholder="Enter second number"
              required
            />
          </label>

          <button type="submit" disabled={!canSubmit}>
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </form>

        {error && <p className="message error">{error}</p>}

        {result !== null && !error && (
          <p className="message success">
            Result: <strong>{result}</strong>
          </p>
        )}
      </section>
    </main>
  );
}

export default App;
