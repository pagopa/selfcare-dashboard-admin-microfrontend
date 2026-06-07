import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { useRef } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  grow?: number;
};

export const DateFilterField = ({ label, value, onChange, min, max, grow = 1 }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const displayValue = value ? new Date(`${value}T00:00:00`).toLocaleDateString() : '';

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    if ('showPicker' in input && typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  return (
    <FormControl
      size="small"
      sx={{
        flexGrow: grow,
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0,
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        position: 'relative',
      }}
    >
      <InputLabel shrink={!!value}>{label}</InputLabel>
      <OutlinedInput
        label={label}
        readOnly
        value={displayValue}
        onClick={openPicker}
        endAdornment={
          <ArrowDropDownIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', pointerEvents: 'none' }} />
        }
        sx={{
          cursor: 'pointer',
          '& input': { cursor: 'pointer' },
        }}
      />
      <input
        ref={inputRef}
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 0,
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </FormControl>
  );
};
