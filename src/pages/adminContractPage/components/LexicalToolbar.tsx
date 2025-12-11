import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  MenuItem,
  Select,
} from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  $createParagraphNode,
} from 'lexical';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  BugReport,
  Link,
  Image,
  Title,
  FormatColorText,
} from '@mui/icons-material';

interface LexicalToolbarProps {
  onDebugToggle?: () => void;
  showDebug?: boolean;
}

const getFormatsFromSelection = (selection: any): Array<string> => [
  ...(selection.hasFormat('bold') ? ['bold'] : []),
  ...(selection.hasFormat('italic') ? ['italic'] : []),
  ...(selection.hasFormat('underline') ? ['underline'] : []),
  ...(selection.hasFormat('strikethrough') ? ['strikethrough'] : []),
  ...(selection.hasFormat('code') ? ['code'] : []),
];

const LexicalToolbar = ({
  onDebugToggle,
  showDebug = true,
}: LexicalToolbarProps): JSX.Element => {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Array<string>>([]);
  const [blockType, setBlockType] = useState<string>('normal');
  const [fontSize, setFontSize] = useState('15');

  const updateToolbar = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const formats = getFormatsFromSelection(selection);
        setSelectedFormats(formats);
      }
    });
  }, [editor]);

  useEffect(() => {
    editor.registerUpdateListener(() => {
      editor.update(() => {
        updateToolbar();
      });
    });

    const undoCommand = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );

    const redoCommand = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );

    return () => {
      undoCommand();
      redoCommand();
    };
  }, [editor, updateToolbar]);

  const handleFormatToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newFormats: Array<string>
  ): void => {
    newFormats.forEach((format) => {
      if (!selectedFormats.includes(format)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
      }
    });

    selectedFormats.forEach((format) => {
      if (!newFormats.includes(format)) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as any);
      }
    });
  };

  const handleBlockTypeChange = (e: any) => {
    const newBlockType = e.target.value;
    setBlockType(newBlockType);

    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        if (newBlockType === 'normal') {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (newBlockType.startsWith('h')) {
          const level = parseInt(newBlockType.charAt(1)) as 1 | 2 | 3;
          $setBlocksType(selection, () => new HeadingNode(`h${level}`));
        } else if (newBlockType === 'quote') {
          $setBlocksType(selection, () => new QuoteNode());
        }
      }
    });
  };

  const insertBulletList = (): void => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const insertNumberedList = (): void => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const handleFontSizeDecrease = (): void => {
    const currentSize = parseInt(fontSize, 10);
    const newSize = Math.max(10, currentSize - 1);
    setFontSize(String(newSize));
    applyFontSize(String(newSize));
  };

  const handleFontSizeIncrease = (): void => {
    const currentSize = parseInt(fontSize, 10);
    const newSize = Math.min(32, currentSize + 1);
    setFontSize(String(newSize));
    applyFontSize(String(newSize));
  };

  const applyFontSize = (size: string): void => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection && $isRangeSelection(selection)) {
        selection.getNodes().forEach((node: any) => {
          if (node.setStyle) {
            const currentStyle = node.getStyle() || '';
            const newStyle = currentStyle.replace(/font-size:\s*\d+px;?/g, '').trim();
            node.setStyle(`${newStyle} font-size: ${size}px;`.trim());
          }
        });
      }
    });
  };

  const handleLinkClick = () => {
    const url = prompt('Inserisci l\'URL del link:');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const handleColorClick = () => {
    const color = prompt('Inserisci il colore (es. #FF0000 o red):', '#000000');
    if (color) {
      editor.update(() => {
        const selection = $getSelection();
        if (selection && $isRangeSelection(selection)) {
          selection.getNodes().forEach((node: any) => {
            if (node.setStyle) {
              const currentStyle = node.getStyle() || '';
              const newStyle = currentStyle.replace(/color:\s*[^;]+;?/g, '').trim();
              node.setStyle(`${newStyle} color: ${color};`.trim());
            }
          });
        }
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 1,
        backgroundColor: '#ffffff',
        borderRadius: 1,
        flexWrap: 'wrap',
        alignItems: 'center',
        border: '1px solid #e5e7eb',
        minHeight: '48px',
      }}
    >
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Annulla (Ctrl+Z)">
          <span>
            <Button
              size="small"
              onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
              disabled={!canUndo}
              variant="text"
              sx={{
                minWidth: '32px',
                p: 0.5,
                color: canUndo ? '#1f2937' : '#d1d5db',
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              <Undo fontSize="small" />
            </Button>
          </span>
        </Tooltip>
        <Tooltip title="Ripeti (Ctrl+Y)">
          <span>
            <Button
              size="small"
              onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
              disabled={!canRedo}
              variant="text"
              sx={{
                minWidth: '32px',
                p: 0.5,
                color: canRedo ? '#1f2937' : '#d1d5db',
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              <Redo fontSize="small" />
            </Button>
          </span>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <Select
          size="small"
          value={blockType}
          onChange={handleBlockTypeChange}
          sx={{
            height: '32px',
            fontSize: '13px',
            textTransform: 'capitalize',
          }}
        >
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="h1">Heading 1</MenuItem>
          <MenuItem value="h2">Heading 2</MenuItem>
          <MenuItem value="h3">Heading 3</MenuItem>
          <MenuItem value="quote">Quote</MenuItem>
        </Select>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <Select
          size="small"
          value="Arial"
          disabled
          sx={{
            height: '32px',
            fontSize: '13px',
            width: '100px',
          }}
        >
          <MenuItem value="Arial">Arial</MenuItem>
        </Select>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Diminuisci dimensione">
          <Button
            size="small"
            variant="text"
            onClick={handleFontSizeDecrease}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              fontSize: '12px',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            −
          </Button>
        </Tooltip>
        <Box
          sx={{
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '12px',
            minWidth: '30px',
            textAlign: 'center',
          }}
        >
          {fontSize}
        </Box>
        <Tooltip title="Aumenta dimensione">
          <Button
            size="small"
            variant="text"
            onClick={handleFontSizeIncrease}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              fontSize: '12px',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            +
          </Button>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={0.5}>
        <ToggleButtonGroup
          value={selectedFormats}
          onChange={handleFormatToggle}
          size="small"
          aria-label="text formatting"
        >
          <Tooltip title="Grassetto (Ctrl+B)">
            <ToggleButton value="bold" aria-label="bold" sx={{ border: 'none' }}>
              <FormatBold fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Corsivo (Ctrl+I)">
            <ToggleButton value="italic" aria-label="italic" sx={{ border: 'none' }}>
              <FormatItalic fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Sottolineato (Ctrl+U)">
            <ToggleButton value="underline" aria-label="underline" sx={{ border: 'none' }}>
              <FormatUnderlined fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Codice">
            <ToggleButton value="code" aria-label="code" sx={{ border: 'none' }}>
              <Code fontSize="small" />
            </ToggleButton>
          </Tooltip>
          <Tooltip title="Barrato">
            <ToggleButton value="strikethrough" aria-label="strikethrough" sx={{ border: 'none' }}>
              <StrikethroughS fontSize="small" />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Link">
          <Button
            size="small"
            variant="text"
            onClick={handleLinkClick}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <Link fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Colore Testo">
          <Button
            size="small"
            variant="text"
            onClick={handleColorClick}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <FormatColorText fontSize="small" />
          </Button>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Lista non ordinata">
          <Button
            size="small"
            onClick={insertBulletList}
            variant="text"
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <FormatListBulleted fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Lista ordinata">
          <Button
            size="small"
            onClick={insertNumberedList}
            variant="text"
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <FormatListNumbered fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Citazione">
          <Button
            size="small"
            variant="text"
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if (selection) {
                  $setBlocksType(selection, () => new QuoteNode());
                }
              });
            }}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <FormatQuote fontSize="small" />
          </Button>
        </Tooltip>
      </Stack>

      <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />

      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Titolo (H1)">
          <Button
            size="small"
            variant="text"
            onClick={() => {
              setBlockType('h1');
              editor.update(() => {
                const selection = $getSelection();
                if (selection) {
                  $setBlocksType(selection, () => new HeadingNode('h1'));
                }
              });
            }}
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <Title fontSize="small" />
          </Button>
        </Tooltip>
        <Tooltip title="Immagine">
          <Button
            size="small"
            variant="text"
            sx={{
              minWidth: '32px',
              p: 0.5,
              color: '#1f2937',
              '&:hover': { backgroundColor: '#f3f4f6' },
            }}
          >
            <Image fontSize="small" />
          </Button>
        </Tooltip>
      </Stack>

      <Box sx={{ ml: 'auto' }} />

      <Stack direction="row" spacing={0.5}>
        <Tooltip title={showDebug ? 'Nascondi Debug' : 'Mostra Debug'}>
          <Button
            size="small"
            onClick={onDebugToggle}
            variant={showDebug ? 'contained' : 'text'}
            sx={{
              minWidth: '32px',
              p: 0.5,
              backgroundColor: showDebug ? '#dbeafe' : 'transparent',
              color: showDebug ? '#1e40af' : '#6b7280',
              '&:hover': {
                backgroundColor: showDebug ? '#bfdbfe' : '#f3f4f6',
              },
            }}
          >
            <BugReport fontSize="small" />
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default LexicalToolbar;
