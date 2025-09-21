/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./syntax-highlighter";

const components: Partial<Components> = {
  pre: ({ children }) => {
    // Extract the code element and its className
    const codeElement = React.Children.toArray(children).find(
      (child): child is React.ReactElement<{ className?: string; children: React.ReactNode }> => 
        React.isValidElement(child) && child.type === 'code'
    );
    
    if (codeElement && codeElement.props.className) {
      const codeText = typeof codeElement.props.children === 'string' 
        ? codeElement.props.children 
        : React.Children.toArray(codeElement.props.children).join('');
      
      return (
        <CodeBlock className={codeElement.props.className}>
          {codeText}
        </CodeBlock>
      );
    }
    
    // Fallback for plain pre without syntax highlighting
    return (
      <div className="w-full min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm whitespace-pre" style={{ whiteSpace: 'pre', wordBreak: 'keep-all', wordWrap: 'normal', minWidth: 'max-content' }}>
          {children}
        </pre>
      </div>
    );
  },
  code: ({ node, className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="text-white font-bold font-mono break-words" {...props}>
          {children}
        </code>
      );
    }
    
    // For block code, use syntax highlighting
    const codeText = typeof children === 'string' ? children : String(children);
    const language = className ? className.replace('language-', '') : 'text';
    
    return (
      <CodeBlock className={className || ''}>
        {codeText}
      </CodeBlock>
    );
  },
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
  table: ({ node, children, ...props }) => {
    return (
      <div className="w-full min-w-0 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 my-4">
        <table className="min-w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    );
  },
  thead: ({ node, children, ...props }) => {
    return (
      <thead className="bg-gray-800/50" {...props}>
        {children}
      </thead>
    );
  },
  tbody: ({ node, children, ...props }) => {
    return (
      <tbody {...props}>
        {children}
      </tbody>
    );
  },
  tr: ({ node, children, ...props }) => {
    return (
      <tr className="border-b border-gray-700/50 hover:bg-gray-800/30" {...props}>
        {children}
      </tr>
    );
  },
  th: ({ node, children, ...props }) => {
    return (
      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200 whitespace-nowrap" {...props}>
        {children}
      </th>
    );
  },
  td: ({ node, children, ...props }) => {
    return (
      <td className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap" {...props}>
        {children}
      </td>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <div className="markdown-content w-full min-w-0">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
