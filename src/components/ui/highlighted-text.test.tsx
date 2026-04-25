import { render, screen } from '@testing-library/react';
import { HighlightedText } from './highlighted-text';
import { describe, it, expect } from 'vitest';

describe('HighlightedText', () => {
  it('renders text without highlighting when query is empty', () => {
    render(<HighlightedText text="Hello World" query="" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('highlights matching text case-insensitively', () => {
    const { container } = render(<HighlightedText text="Hello World" query="hello" />);
    const highlighted = container.querySelector('span.bg-yellow-200');
    expect(highlighted).toBeInTheDocument();
    expect(highlighted).toHaveTextContent('Hello');
  });

  it('highlights multiple occurrences', () => {
    const { container } = render(<HighlightedText text="Test test TEST" query="test" />);
    const highlights = container.querySelectorAll('span.bg-yellow-200');
    expect(highlights).toHaveLength(3);
  });

  it('renders original text when no match found', () => {
    const { container } = render(<HighlightedText text="Hello World" query="xyz" />);
    expect(container.querySelector('span.bg-yellow-200')).not.toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
