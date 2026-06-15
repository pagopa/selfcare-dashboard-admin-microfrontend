import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
      inputFormat=""
      minDate={min ? dayjs(min) : undefined}
      maxDate={max ? dayjs(max) : undefined}
      dayOfWeekFormatter={(day) => {
        const map: Record<string, string> = {
          Do: 'Dom', Lu: 'Lun', Ma: 'Mar', Me: 'Mer', Gi: 'Gio', Ve: 'Ven', Sa: 'Sab',
        };
        return map[day] ?? day;
      }}
      PaperProps={{
        sx: {
          '& .MuiPickersCalendarHeader-label': {
            textTransform: 'capitalize',
          },
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: '#0B3EE3 !important',
            '&:hover': {
              backgroundColor: '#0B3EE3',
            },
          },
          '& .MuiPickersArrowSwitcher-button': {
            color: '#0B3EE3',
          },
          '& .MuiPickersCalendarHeader-switchViewButton': {
            color: 'rgba(0, 0, 0, 0.87)',
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((prev) => !prev);
          }}
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: !!value || open,
          }}
          inputProps={{
            ...params.inputProps,
            value: parsedValue?.isValid() ? parsedValue.format('DD/MM/YYYY') : '',
            readOnly: true,
            tabIndex: -1,
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                <KeyboardArrowDownIcon
                  sx={{
                    color: 'rgba(0, 0, 0, 0.54)',
                    fontSize: '1.5rem',
                    pointerEvents: 'none',
                    transition: 'transform 0.2s ease',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
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
            },
            '& .MuiInputAdornment-positionEnd': {
              marginLeft: '2px',
              width: '20px',
              minWidth: '20px',
              maxWidth: '20px',
              flexShrink: 0,
            },
          }}
        />
      )}
    />
  );
};
