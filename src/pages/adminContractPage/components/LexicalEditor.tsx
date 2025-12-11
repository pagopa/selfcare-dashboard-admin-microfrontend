import { Box, Paper, Stack, Divider, Button, Tooltip } from '@mui/material';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Download } from '@mui/icons-material';
import { getContractTemplate } from '../utils/contractTemplate';
import {
  InitialConfigType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import LexicalToolbar from './LexicalToolbar';
import EditorDebugView from './EditorDebugView';
import './LexicalEditor.css';

const editorConfig: InitialConfigType = {
  namespace: 'LexicalEditor',
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    AutoLinkNode,
    LinkNode,
  ],
  onError: (error) => {
    console.error(error);
  },
  theme: {
    text: {
      bold: 'editor-text-bold',
      underline: 'editor-text-underline',
      italic: 'editor-text-italic',
      strikethrough: 'editor-text-strikethrough',
    },
    heading: {
      h1: 'editor-h1',
      h2: 'editor-h2',
      h3: 'editor-h3',
    },
    list: {
      nested: {
        listitem: 'editor-nested-listitem',
      },
      ol: 'editor-ol',
      ul: 'editor-ul',
      listitem: 'editor-listitem',
    },
    quote: 'editor-quote',
    code: 'editor-code',
    codeHighlight: {
      aml: 'editor-tokenAttr',
      attr: 'editor-tokenAttr',
      boolean: 'editor-tokenProperty',
      cdata: 'editor-tokenComment',
      char: 'editor-tokenSelector',
      class: 'editor-tokenFunction',
      comment: 'editor-tokenComment',
      decimal: 'editor-tokenVariable',
      doctype: 'editor-tokenDoctype',
      entity: 'editor-tokenEntity',
      flag: 'editor-tokenVariable',
      function: 'editor-tokenFunction',
      important: 'editor-tokenVariable',
      keyword: 'editor-tokenKeyword',
      namespace: 'editor-tokenVariable',
      number: 'editor-tokenVariable',
      operator: 'editor-tokenOperator',
      prolog: 'editor-tokenDoctype',
      property: 'editor-tokenProperty',
      pseudo: 'editor-tokenProperty',
      punctuation: 'editor-tokenPunctuation',
      regex: 'editor-tokenVariable',
      selector: 'editor-tokenSelector',
      string: 'editor-tokenSelector',
      symbol: 'editor-tokenProperty',
      tag: 'editor-tokenTag',
      variable: 'editor-tokenVariable',
    },
  },
};

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))?[a-zA-Z0-9][\w-]*(?:\.[\w-]*)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+/;

const EMAIL_MATCHER =
  /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (!match) {
      return null;
    }
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: match[0].includes('http') ? match[0] : `https://${match[0]}`,
    };
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text);
    if (!match) {
      return null;
    }
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: `mailto:${match[0]}`,
    };
  },
];

interface LexicalEditorProps {
  onContentChange?: (html: string) => void;
}

const LexicalEditor = ({ onContentChange }: LexicalEditorProps): JSX.Element => {
  const [showDebugView, setShowDebugView] = useState(true);
  const editorRef = useRef<any>(null);

  const getEditorContent = useCallback((): string => {
    if (!editorRef.current) return '';
    const editorElement = editorRef.current.querySelector('.editor-content-editable');
    if (!editorElement) return '';
    return editorElement.innerHTML;
  }, []);

  const handleExport = useCallback((): void => {
    const content = getEditorContent();
    const htmlContent = getContractTemplate(content);

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contratto-${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, [getEditorContent]);

  const handleEditorChange = useCallback((): void => {
    const content = getEditorContent();
    if (onContentChange) {
      onContentChange(content);
    }
  }, [getEditorContent, onContentChange]);

  useEffect(() => {
    const editorElement = editorRef.current?.querySelector('.editor-content-editable');
    if (!editorElement) {
      return;
    }
    editorElement.addEventListener('input', handleEditorChange);
    return () => {
      editorElement.removeEventListener('input', handleEditorChange);
    };
  }, [handleEditorChange]);

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid #E3E3E3' }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box />
          <Tooltip title="Scarica il contratto in HTML">
            <Button
              startIcon={<Download />}
              onClick={handleExport}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#0066cc',
                color: '#fff',
                '&:hover': { backgroundColor: '#0052a3' },
              }}
            >
              Scarica HTML
            </Button>
          </Tooltip>
        </Box>
        <LexicalComposer initialConfig={editorConfig}>
          <Box ref={editorRef} sx={{ position: 'relative' }}>
            <LexicalToolbar onDebugToggle={() => setShowDebugView(!showDebugView)} showDebug={showDebugView} />
            <Box
              sx={{
                position: 'relative',
                marginTop: 1,
                borderRadius: 1,
                border: '1px solid #E3E3E3',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="editor-content-editable"
                    style={{
                      minHeight: '400px',
                      padding: '16px',
                      outline: 'none',
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  />
                }
                placeholder={
                  <div className="editor-placeholder">
                    Scrivi il contenuto del contratto qui...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ListPlugin />
              <LinkPlugin />
              <AutoLinkPlugin matchers={MATCHERS} />
              <MarkdownShortcutPlugin
                transformers={[
                  {
                    dependencies: [HeadingNode],
                    export: (node: any) => {
                      if (!('getLevel' in node)) {
                        return null;
                      }
                      const level = (node as any).getLevel() as number;
                      return `${'#'.repeat(level)} `;
                    },
                    regExp: /^(#{1,3})\s/,
                    replace: (parentNode: any, _match: any) => {
                      const level = _match.length as 1 | 2 | 3;
                      parentNode.replace(new HeadingNode(`h${level}`));
                      return true;
                    },
                    type: 'element',
                  } as any,
                ]}
              />
              {showDebugView && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <EditorDebugView />
                </>
              )}
            </Box>
          </Box>
        </LexicalComposer>
      </Stack>
    </Paper>
  );
};

export default LexicalEditor;
