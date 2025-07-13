'use client';

import React, { useState } from 'react';
import { Heading, Input, Button } from '../../../components';
import { createDecision } from './actions';

export default function NewDecisionPage() {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (title.trim() && !isLoading) {
      setIsLoading(true);
      try {
        await createDecision(title);
        // Redirect to decisions page after successful creation
        window.location.href = '/decisions';
      } catch (error) {
        console.error('Failed to create decision:', error);
        // You could add error handling UI here
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="font-sans bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Heading size="lg">New Decision</Heading>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-text mb-2">
              Decision Title
            </label>
            <Input
              placeholder="e.g. Should we buy this house?"
              value={title}
              onChange={setTitle}
            />
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleNext}
              disabled={!title.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 