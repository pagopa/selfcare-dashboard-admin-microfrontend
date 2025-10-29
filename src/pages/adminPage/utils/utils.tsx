import { Typography, Tooltip } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

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
