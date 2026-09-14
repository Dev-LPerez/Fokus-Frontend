'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 font-mono text-xs shadow-xs">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-800/90 border-b border-slate-700/80 text-slate-300">
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors p-1 rounded hover:bg-slate-700 cursor-pointer"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-slate-100 leading-relaxed font-mono">
        <code>{children}</code>
      </div>
    </div>
  );
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-800 break-words space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-base font-bold text-slate-900 mt-4 mb-2 first:mt-0 tracking-tight font-display">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold text-slate-900 mt-3 mb-1.5 first:mt-0 tracking-tight font-display">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 mt-2.5 mb-1 first:mt-0 font-mono">
              {children}
            </h3>
          ),

          // Paragraphs & text
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-800 font-normal">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-slate-950">{children}</strong>,
          em: ({ children }) => <em className="italic text-slate-700">{children}</em>,

          // Lists
          ul: ({ children }) => <ul className="my-2 space-y-1 list-disc list-inside pl-1 text-slate-800">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 space-y-1 list-decimal list-inside pl-1 text-slate-800">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-slate-800">{children}</li>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 pl-3.5 border-l-2 border-indigo-500 text-slate-700 italic bg-indigo-50/50 py-1.5 rounded-r-xl">
              {children}
            </blockquote>
          ),

          // Code
          code: ({ className, children, ...props }) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-indigo-600 font-mono text-[12px] font-medium"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className}>{children}</CodeBlock>;
          },

          // Tables
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-slate-100">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-slate-50/70 transition-colors">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-semibold text-slate-900">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2 text-slate-700">{children}</td>,

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors font-medium cursor-pointer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
