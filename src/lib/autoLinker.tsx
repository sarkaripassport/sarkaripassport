import React from 'react';
import Link from 'next/link';

// Simple dictionary mapping keywords to the pSEO Matrix path
const matrixTags = {
  "10th Pass": "10th-pass",
  "12th Pass": "12th-pass",
  "Graduate": "graduate",
  "Post Graduate": "post-graduate",
  "Diploma": "diploma",
  "Police": "police",
  "Railway": "railway",
  "Bank": "bank",
  "Defense": "defense",
  "SSC": "ssc",
  "UPSC": "upsc",
  "Teacher": "teacher",
  "UP": "up",
  "Bihar": "bihar",
  "Maharashtra": "maharashtra",
  "Delhi": "delhi"
};

/**
 * Parses raw text and automatically injects Next.js <Link> components
 * for high-value matrix keywords, passing internal link juice.
 */
export function AutoLinkedText({ text, lang }: { text: string; lang: string }) {
  if (!text) return <></>;

  // Build a regex that matches any of the keys, ignoring case
  const keys = Object.keys(matrixTags);
  const regex = new RegExp(`(${keys.join('|')})`, 'gi');

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const lowerPart = part.toLowerCase();
        // Find if this part is a key (case-insensitive match)
        const matchKey = Object.keys(matrixTags).find(k => k.toLowerCase() === lowerPart);

        if (matchKey) {
          const slug = matrixTags[matchKey as keyof typeof matrixTags];
          return (
            <Link 
              key={i} 
              href={`/${lang}/explore/${slug}`}
              className="text-blue-600 hover:underline font-semibold"
              title={`Explore ${matchKey} Jobs`}
            >
              {part}
            </Link>
          );
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
