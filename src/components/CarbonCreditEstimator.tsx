'use client';

import { useState, FormEvent } from 'react';

export default function CarbonCreditEstimator() {
  const [trees, setTrees] = useState<string>('');
  const [estimate, setEstimate] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const numTrees = parseInt(trees, 10);
    if (isNaN(numTrees) || numTrees <= 0) {
      setEstimate('Please enter a valid number of trees.');
      return;
    }

    // Formula: Each mature tree absorbs about 21 kg CO2/year
    // 1 carbon credit = 1000 kg CO2
    const credits = (numTrees * 21) / 1000;
    setEstimate(`Estimated credits per year: ${credits.toFixed(2)} (based on ${numTrees} trees)`);
    setTrees('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Carbon Credit Estimator</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input 
          type="number" 
          placeholder="Number of Trees" 
          value={trees}
          onChange={(e) => setTrees(e.target.value)}
          className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
          required 
        />
        <button 
          type="submit" 
          className="btn w-full py-2 px-4 rounded transition-colors hover:opacity-90"
        >
          Estimate Credits
        </button>
      </form>
      {estimate && (
        <div className="text-sm mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-500">
          {estimate}
        </div>
      )}
    </div>
  );
}