import { Typography, Tooltip } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { ENV } from '../../../utils/env';

export const TruncatedTextWithTooltip = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    }
  }, [text]);

  const content = (
    <Typography
      ref={textRef}
      fontWeight="fontWeightMedium"
      noWrap
      sx={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
        maxWidth: '100%',
      }}
    >
      {text || '-'}
    </Typography>
  );

  return isTruncated ? (
    <Tooltip title={text} placement="top-start" arrow>
      {content}
    </Tooltip>
  ) : (
    content
  );
};
const ALLOWED_PREFIXES: Array<string> = ENV.ALLOWED_PREFIXES.split(',')
  .map((p : string) => p.trim())
  .filter(Boolean); // Removes empty strings if the env is malformed

export const isProductAllowed = (productId: string): boolean =>
  ALLOWED_PREFIXES.some((prefix) => productId.startsWith(prefix));
