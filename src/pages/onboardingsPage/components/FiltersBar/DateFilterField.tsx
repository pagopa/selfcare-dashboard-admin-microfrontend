import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/it';
import { useState } from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  grow?: number;
};

export const DateFilterField = ({ label, value, onChange, min, max, grow = 1 }: Props) => {
  const [open, setOpen] = useState(false);
  const parsedValue = value ? dayjs(value) : null;

  const handleChange = (newValue: Dayjs | null) => {
    onChange(newValue?.isValid() ? newValue.format('YYYY-MM-DD') : '');
  };

  return (
    <DatePicker
      label={label}
      value={parsedValue}
      onChange={handleChange}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputFormat="DD/MM/YYYY"
      minDate={min ? dayjs(min) : undefined}
      maxDate={max ? dayjs(max) : undefined}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: !!value || open,
          }}
          inputProps={{
            ...params.inputProps,
            readOnly: true,
            tabIndex: -1,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end" sx={{ marginRight: '7px' }}>
                <ArrowDropDownIcon
                  sx={{
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontSize: '1.5rem',
                    pointerEvents: 'none',
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            flexGrow: grow,
            flexShrink: 1,
            flexBasis: 0,
            minWidth: 0,
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            '& .MuiInputBase-root': {
              cursor: 'pointer',
            },
            '& .MuiInputBase-input': {
              cursor: 'pointer',
              paddingRight: '32px !important',
            },
          }}
        />
      )}
    />
  );
};
