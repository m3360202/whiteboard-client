import { IconCheck, IconClipboard, IconDownload } from '@tabler/icons-react';
import { FC, memo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import React from 'react';


import {
  generateRandomString,
  programmingLanguages,
} from './CodeblockHelper';

interface Props {
  language: string;
  value: string;
}

export const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const [isCopied, setIsCopied] = useState<Boolean>(false);

  const copyToClipboard = () => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
  };
  const downloadAsFile = () => {
    const fileExtension = programmingLanguages[language] || '.file';
    const suggestedFileName = `file-${generateRandomString(
      3,
      true,
    )}${fileExtension}`;
    const fileName = window.prompt('Enter file name',
      suggestedFileName,
    );

    if (!fileName) {
      // user pressed cancel on prompt
      return;
    }

    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div style={{ position: 'relative', fontFamily: 'sans-serif', fontSize: '14px', backgroundColor:"rgba(40, 44, 52, 0.9)" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px', paddingBottom: '6px', paddingLeft: '16px', paddingRight: '16px' }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'lowercase', color: 'white' }}>{language}</span>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            style={{ display: 'flex', gap: '6px', alignItems: 'center', background: 'none', padding: '4px', fontSize: '0.75rem', color: 'white', cursor: 'pointer' }}
            onClick={copyToClipboard}
          >
            {isCopied ? <IconCheck size={18} /> : <IconClipboard size={18} />}
            {isCopied ? 'Copied!' : 'Copy code'}
          </button>
          <button
            style={{ display: 'flex', alignItems: 'center', background: 'none', padding: '4px', fontSize: '0.75rem', color: 'white', cursor: 'pointer' }}
            onClick={downloadAsFile}
          >
            <IconDownload size={18} />
          </button>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0 }}
      >
        {value}
      </SyntaxHighlighter>
    </div>

  );
});
CodeBlock.displayName = 'CodeBlock';
