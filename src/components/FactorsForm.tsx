'use client';

import React, { useState } from 'react';
import { Button, Heading } from './index';
import { saveFactors } from '../app/decisions/[id]/actions';
import { useRouter, useParams } from 'next/navigation';

interface Factor {
  id?: string;
  text: string;
  weight: number | null;
}

interface FactorsFormProps {
  initialFactors: Factor[];
}

export default function FactorsForm({ initialFactors }: FactorsFormProps) {
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [newText, setNewText] = useState('');
  const [newWeight, setNewWeight] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleAdd = () => {
    if (!newText.trim() || !newWeight) return;
    setFactors([...factors, { text: newText.trim(), weight: newWeight }]);
    setNewText('');
    setNewWeight(null);
  };

  const handleEdit = (idx: number, field: 'text' | 'weight', value: string | number) => {
    setFactors(factors => factors.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  };

  const handleDelete = (idx: number) => {
    setFactors(factors => factors.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveFactors(params.id as string, factors);
    setIsSaving(false);
    router.refresh();
  };

  const allValid = factors.length > 0 && factors.every(f => f.text.trim() && f.weight);

  return (
    <div className="space-y-4">
      <Heading size="md" className="mb-1">Factors</Heading>
      <p className="text-gray-text text-sm mb-4">Factors are the things that matter to you in making this decision. For example, if you’re choosing a laptop, factors might be price, battery life, or screen size. Rate how important each factor is to you.</p>
      <div className="space-y-3">
        {factors.map((factor, idx) => (
          <div key={factor.id || idx} className="p-3 border border-gray-border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 border border-gray-border rounded px-2 py-1"
                value={factor.text}
                onChange={e => handleEdit(idx, 'text', e.target.value)}
                placeholder="Factor name"
                disabled={isSaving}
              />
              <button
                onClick={() => handleDelete(idx)}
                disabled={isSaving}
                className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                aria-label="Delete factor"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-gray-text">Importance</span>
              {[1,2,3,4,5].map(w => (
                <label key={w} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name={`weight-${idx}`}
                    value={w}
                    checked={factor.weight === w}
                    onChange={() => handleEdit(idx, 'weight', w)}
                    disabled={isSaving}
                  />
                  <span className="text-xs text-gray-text">{w}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <input
          type="text"
          className="flex-1 border border-gray-border rounded px-2 py-1"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add a new factor"
          disabled={isSaving}
        />
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-text">Importance</span>
          {[1,2,3,4,5].map(w => (
            <label key={w} className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="new-weight"
                value={w}
                checked={newWeight === w}
                onChange={() => setNewWeight(w)}
                disabled={isSaving}
              />
              <span className="text-xs text-gray-text">{w}</span>
            </label>
          ))}
        </div>
        <Button className="w-fit" size="sm" onClick={handleAdd} disabled={isSaving || !newText.trim() || !newWeight}>
          Add
        </Button>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={handleSave} disabled={!allValid || isSaving} className="bg-green-600 hover:bg-green-700">
          {isSaving ? 'Saving...' : 'Save Factors'}
        </Button>
      </div>
    </div>
  );
} 