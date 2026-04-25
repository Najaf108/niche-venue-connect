import React from 'react';

interface HighlightedTextProps {
  text: string;
  query: string;
  className?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, query, className }) => {
  if (!query || !text) {
    return <span className={className}>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span className={className}>
      {parts.map((part, index) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={index} className="bg-yellow-200 dark:bg-yellow-900 text-foreground font-medium rounded-sm px-0.5">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};
