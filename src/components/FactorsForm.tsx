'use client';

import React, { useState } from 'react';
import { Button, Heading, RatingButton } from './index';
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

  const getImportanceColor = (weight: number) => {
    if (weight <= 2) return 'text-blue-600 bg-blue-50';
    if (weight <= 3) return 'text-green-600 bg-green-50';
    if (weight <= 4) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getImportanceLabel = (weight: number) => {
    if (weight <= 2) return 'Low';
    if (weight <= 3) return 'Medium';
    if (weight <= 4) return 'High';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <div>
        <Heading size="md" className="mb-2">Factors</Heading>
        <p className="text-gray-text text-sm">
          Factors are the things that matter to you in making this decision. Rate how important each factor is to you.
        </p>
      </div>

      {/* Existing Factors */}
      <div className="space-y-4">
        {factors.map((factor, idx) => (
          <div 
            key={factor.id || idx} 
            className="group relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full text-lg font-medium text-gray-900 border-none bg-transparent focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded px-2 py-1 -ml-2"
                  value={factor.text}
                  onChange={e => handleEdit(idx, 'text', e.target.value)}
                  placeholder="Factor name"
                  disabled={isSaving}
                />
                {factor.weight && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(factor.weight)}`}>
                      {getImportanceLabel(factor.weight)} Importance
                    </span>
                    <span className="text-sm text-gray-500">({factor.weight}/5)</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(idx)}
                disabled={isSaving}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                aria-label="Delete factor"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Importance:</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(weight => (
                    <RatingButton
                      key={weight}
                      value={weight}
                      selected={factor.weight === weight}
                      onClick={() => handleEdit(idx, 'weight', weight)}
                      disabled={isSaving}
                      className="w-8 h-8 text-xs"
                    />
                  ))}
                </div>
              </div>
              
              {factor.weight && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      factor.weight <= 2 ? 'bg-blue-500' :
                      factor.weight <= 3 ? 'bg-green-500' :
                      factor.weight <= 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(factor.weight / 5) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Factor */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6">
        <div className="space-y-4">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Enter a new factor (e.g., Cost, Quality, Time)"
            disabled={isSaving}
          />
          
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Set importance:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(weight => (
                <RatingButton
                  key={weight}
                  value={weight}
                  selected={newWeight === weight}
                  onClick={() => setNewWeight(weight)}
                  disabled={isSaving}
                  className="w-10 h-10"
                />
              ))}
            </div>
          </div>
          
          <Button 
            className="w-fit bg-primary hover:bg-primary-dark text-white" 
            size="sm" 
            onClick={handleAdd} 
            disabled={isSaving || !newText.trim() || !newWeight}
          >
            Add Factor
          </Button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button 
          onClick={handleSave} 
          disabled={!allValid || isSaving} 
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
        >
          {isSaving ? 'Saving...' : 'Save Factors'}
        </Button>
      </div>
    </div>
  );
} 