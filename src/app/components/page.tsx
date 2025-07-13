'use client';

import React, { useState } from 'react';
import {
  Logo,
  Heading,
  Paragraph,
  Button,
  DecisionCard,
  Input,
  Checkbox,
  RatingButton,
  ProgressBar
} from '../../components';

export default function ComponentsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [checkboxes, setCheckboxes] = useState({
    'Financial Sustainability': false,
    'Future-proofing': false,
    'Emotional readiness': false,
    'Social fit': false
  });

  const handleCheckboxChange = (label: string, checked: boolean) => {
    setCheckboxes(prev => ({ ...prev, [label]: checked }));
  };

  return (
    <main className="font-sans bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Heading size="lg">Component Library</Heading>
          <Paragraph>
            A showcase of all the reusable components for the decision-maker app.
          </Paragraph>
        </div>

        {/* Logo Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Small</h3>
              <Logo size="sm" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Medium (Default)</h3>
              <Logo size="md" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Large</h3>
              <Logo size="lg" />
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Typography</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Headings</h3>
              <div className="space-y-2">
                <Heading size="sm">Small Heading</Heading>
                <Heading size="md">Medium Heading (Default)</Heading>
                <Heading size="lg">Large Heading</Heading>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Paragraph</h3>
              <Paragraph>
                This is a sample paragraph that demonstrates the styling and layout of the Paragraph component.
              </Paragraph>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Variants</h3>
              <div className="flex gap-4 flex-wrap">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="text">Text Button</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Sizes</h3>
              <div className="flex gap-4 flex-wrap items-center">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">States</h3>
              <div className="flex gap-4 flex-wrap">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Decision Card Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Decision Card</h2>
          <DecisionCard 
            title="Weekend Getaway" 
            status="In Progress" 
          />
        </section>

        {/* Input Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Text Input</h3>
              <Input
                placeholder="e.g. Should we buy this house?"
                value={inputValue}
                onChange={setInputValue}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Joining Code Input</h3>
              <Input
                placeholder="Enter Joining Code"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Disabled Input</h3>
              <Input
                placeholder="This input is disabled"
                disabled
              />
            </div>
          </div>
        </section>

        {/* Checkboxes Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Checkboxes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Horizontal Layout</h3>
              <div className="flex flex-wrap gap-4">
                {Object.entries(checkboxes).map(([label, checked]) => (
                  <Checkbox
                    key={label}
                    label={label}
                    checked={checked}
                    onChange={(checked: boolean) => handleCheckboxChange(label, checked)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Add Custom Factor</h3>
              <Button variant="text" size="sm">+ Add custom factor</Button>
            </div>
          </div>
        </section>

        {/* Rating Buttons Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Rating Buttons</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">1-5 Rating Scale</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <RatingButton
                    key={num}
                    value={num}
                    selected={selectedRating === num}
                    onClick={setSelectedRating}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-text">
                Selected rating: {selectedRating || 'None'}
              </p>
            </div>
          </div>
        </section>

        {/* Progress Bar Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Progress Bar</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Different Heights</h3>
              <div className="space-y-2">
                <ProgressBar progress={60} height="sm" />
                <ProgressBar progress={60} height="md" />
                <ProgressBar progress={60} height="lg" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-text mb-2">Different Progress Values</h3>
              <div className="space-y-2">
                <ProgressBar progress={25} />
                <ProgressBar progress={50} />
                <ProgressBar progress={75} />
                <ProgressBar progress={100} />
              </div>
            </div>
          </div>
        </section>

        {/* Original Layout Section */}
        <section className="bg-transparent p-6 rounded-lg border border-gray-border">
          <h2 className="text-xl font-semibold mb-4">Original Layout</h2>
          <div className="space-y-6">
            <Logo />
            <Heading>Make decisions together, easily</Heading>
            <Paragraph>
              Simplify group decisions with our app. Vote, discuss, and decide together, effortlessly.
            </Paragraph>
            <div className="flex justify-center gap-4">
              <Button>Log in</Button>
              <Button>Join with code</Button>
            </div>
            <DecisionCard title="Weekend Getaway" status="In Progress" />
            <Input placeholder="e.g. Should we buy this house?" />
            <Button variant="text" size="sm">✕</Button>
            <Input placeholder="Enter Joining Code" />
            <div className="flex flex-wrap gap-4">
              {Object.entries(checkboxes).map(([label, checked]) => (
                <Checkbox
                  key={label}
                  label={label}
                  checked={checked}
                                     onChange={(checked: boolean) => handleCheckboxChange(label, checked)}
                />
              ))}
            </div>
            <Button variant="text" size="sm">+ Add custom factor</Button>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <RatingButton
                  key={num}
                  value={num}
                  selected={selectedRating === num}
                  onClick={setSelectedRating}
                />
              ))}
            </div>
            <ProgressBar progress={60} />
          </div>
        </section>
      </div>
    </main>
  );
} 