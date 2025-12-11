import { Box, Typography } from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';

const getFormats = (format: any): Array<string> => {
  const baseFormats: Array<string> = [];
  const boldFormat = format?.bold ? ['bold'] : [];
  const italicFormat = format?.italic ? ['italic'] : [];
  const underlineFormat = format?.underline ? ['underline'] : [];
  return [...baseFormats, ...boldFormat, ...italicFormat, ...underlineFormat];
};

const formatNode = (node: any): string => {
  const type = node.type || 'unknown';
  const textPart = node.text ? ` "${node.text.substring(0, 50)}${node.text.length > 50 ? '...' : ''}"` : '';
  const formats = getFormats(node.format);
  const formatPart = formats.length > 0 ? ` { format: ${formats.join(', ')} }` : '';
  return `${type}${textPart}${formatPart}`;
};

const formatTree = (obj: any): string => {
  const getChildLines = (children: Array<any>, isRoot = false): Array<string> => {
    if (!Array.isArray(children)) {
      return [];
    }

    return children.flatMap((child: any, idx: number) => {
      const childStr = formatNode(child);
      const childLine = isRoot ? `  ├ (${idx + 1}) ${childStr}` : `  | ${childStr}`;
      
      if (child.children && Array.isArray(child.children)) {
        const subchildLines = child.children.map((subchild: any) => `  | ${formatNode(subchild)}`);
        return [childLine, ...subchildLines];
      }
      
      return [childLine];
    });
  };

  if (obj.root && obj.root.children) {
    const rootLine = ['root'];
    const childLines = getChildLines(obj.root.children, true);
    return [...rootLine, ...childLines].join('\n');
  }

  return '';
};

const EditorDebugView = (): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [debugState, setDebugState] = useState<string>('');

  useEffect(() => {
    const updateDebugView = (): void => {
      editor.update(() => {
        const state = editor.getEditorState();
        const json = state.toJSON();
        setDebugState(formatTree(json));
      });
    };

    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateDebugView();
      });
    });

    updateDebugView();
  }, [editor]);

  return (
    <Box
      sx={{
        backgroundColor: '#1f2937',
        color: '#f3f4f6',
        padding: '12px',
        borderRadius: '0 0 4px 4px',
        maxHeight: '250px',
        overflowY: 'auto',
        fontFamily: "'Courier New', monospace",
        fontSize: '12px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      <Typography
        sx={{
          color: '#60a5fa',
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '13px',
          fontFamily: "'Courier New', monospace",
        }}
      >
        📋 Editor State (Debug View)
      </Typography>
      <Typography
        component="div"
        sx={{
          fontSize: '12px',
          lineHeight: '1.5',
          fontFamily: "'Courier New', monospace",
          color: '#d1d5db',
        }}
      >
        {debugState || 'Loading...'}
      </Typography>
    </Box>
  );
};

export default EditorDebugView;
