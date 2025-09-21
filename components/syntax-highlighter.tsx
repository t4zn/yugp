"use client";

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// VS Code Dark+ theme colors (Monaco-like)
const vscodeTheme: any = {
  'code[class*="language-"]': {
    color: '#d4d4d4',
    fontSize: '14px',
    textShadow: 'none',
    fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: '#d4d4d4',
    fontSize: '14px',
    textShadow: 'none',
    fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    msHyphens: 'none',
    hyphens: 'none',
    padding: '0',
    margin: '0',
    overflow: 'auto',
    background: 'transparent',
    border: 'none',
    borderRadius: '0'
  },
  ':not(pre) > code[class*="language-"]': {
    padding: '0',
    borderRadius: '0',
    whiteSpace: 'normal',
    background: 'transparent'
  },
  // Comments
  'comment': { color: '#6a9955', fontStyle: 'italic' },
  'prolog': { color: '#6a9955', fontStyle: 'italic' },
  'doctype': { color: '#6a9955', fontStyle: 'italic' },
  'cdata': { color: '#6a9955', fontStyle: 'italic' },
  
  // Punctuation and operators
  'punctuation': { color: '#d4d4d4' },
  'operator': { color: '#d4d4d4' },
  'entity': { color: '#d4d4d4', cursor: 'help' },
  'url': { color: '#d4d4d4' },
  
  // Properties and attributes
  'property': { color: '#9cdcfe' },
  'tag': { color: '#569cd6' },
  'constant': { color: '#569cd6' },
  'symbol': { color: '#569cd6' },
  'deleted': { color: '#f14c4c' },
  
  // Booleans and numbers
  'boolean': { color: '#569cd6' },
  'number': { color: '#b5cea8' },
  
  // Selectors and variables
  'selector': { color: '#d7ba7d' },
  'attr-name': { color: '#92c5f8' },
  'string': { color: '#ce9178' },
  'char': { color: '#ce9178' },
  'builtin': { color: '#dcdcaa' },
  'variable': { color: '#9cdcfe' },
  'inserted': { color: '#b5cea8' },
  
  // Functions and keywords
  'function': { color: '#dcdcaa' },
  'keyword': { color: '#c586c0' },
  'important': { color: '#569cd6', fontWeight: 'bold' },
  'regex': { color: '#d16969' },
  
  // Class names and types
  'class-name': { color: '#4ec9b0' },
  'attr-value': { color: '#ce9178' },
  'namespace': { color: '#4ec9b0' },
  
  // Special
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' }
};

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className = '' }: CodeBlockProps) {
  // Extract language from className (e.g., "language-javascript" -> "javascript")
  let language = className.replace('language-', '') || 'text';
  
  // If no language specified, try to detect from content or default to javascript for better highlighting
  if (!language || language === 'text') {
    // Simple heuristics to detect common languages
    const content = children.toLowerCase();
    if (content.includes('function') || content.includes('const') || content.includes('let') || content.includes('=>')) {
      language = 'javascript';
    } else if (content.includes('def ') || content.includes('import ') || content.includes('print(')) {
      language = 'python';
    } else if (content.includes('<') && content.includes('>')) {
      language = 'html';
    } else {
      language = 'javascript'; // Default to javascript for better syntax highlighting
    }
  }
  
  return (
    <SyntaxHighlighter
      language={language}
      style={vscodeTheme}
      customStyle={{
        margin: 0,
        padding: 0,
        border: 'none',
        borderRadius: 0,
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        background: 'transparent',
        color: '#d4d4d4',
        overflowX: 'auto',
        whiteSpace: 'pre',
        wordBreak: 'keep-all',
        wordWrap: 'normal'
      }}
      wrapLines={false}
      wrapLongLines={false}
      showLineNumbers={false}
      className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      {children}
    </SyntaxHighlighter>
  );
}
