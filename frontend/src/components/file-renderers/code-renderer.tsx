'use client';

import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';
import { useTheme } from 'next-themes';
import { EditorView } from '@codemirror/view';

interface CodeRendererProps {
  content: string;
  language?: string;
  className?: string;
}

// Map of language aliases to supported language names
const languageAliases: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  html: 'html',
  css: 'css',
  json: 'json',
  md: 'markdown',
  markdown: 'markdown',
  python: 'python',
  py: 'python',
  rust: 'rust',
  go: 'go',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  cs: 'csharp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  sh: 'shell',
  bash: 'shell',
  shell: 'shell',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  // Add more languages as needed
};

export function CodeRenderer({
  content,
  language = '',
  className,
}: CodeRendererProps) {
  // Get current theme
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine the language extension to use
  const langExtension =
    language && languageAliases[language] ? loadLanguage(languageAliases[language] as any) : null;

  // Add line wrapping extension
  const extensions = langExtension ? [langExtension, EditorView.lineWrapping] : [EditorView.lineWrapping];

  // Select the theme based on the current theme
  const theme = mounted && resolvedTheme === 'dark' ? vscodeDark : xcodeLight;

  return (
    <ScrollArea className={cn('w-full h-full', className)}>
      <div className="w-full">
        <CodeMirror
          value={content}
          theme={theme}
          extensions={extensions}
          basicSetup={{
            lineNumbers: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            foldGutter: false,
          }}
          editable={false}
          className="text-sm w-full min-h-full"
          style={{ maxWidth: '100%' }}
          height="auto"
        />
      </div>
    </ScrollArea>
  );
}
