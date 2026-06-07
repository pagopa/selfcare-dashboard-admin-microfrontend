import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ButtonNaked } from '@pagopa/mui-italia';
import 'dayjs/locale/it';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Product } from '../../../../model/Product';
import { DateFilterField } from './DateFilterField';
import { getFiltersConfig } from './filtersConfig';
import { parseFilters, serializeFilters } from './filtersUtils';
import { Filters } from './types';

type Props = {
  products: Array<Product>;
};

export const FiltersBar = ({ products }: Props) => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const filtersConfig = getFiltersConfig(t, products);

  const [draftFilters, setDraftFilters] = useState(() => parseFilters(location.search));

  // Sync draft when URL changes (back/forward navigation)
  useEffect(() => {
    setDraftFilters(parseFilters(location.search));
  }, [location.search]);

  const handleFilterChange = (key: keyof typeof draftFilters, value: string | Array<string>) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const filtersToApply = { ...draftFilters, page: 0 };
    const query = serializeFilters(filtersToApply);
    const current = parseFilters(location.search);

    const isSame = JSON.stringify(current) === JSON.stringify(filtersToApply);

    if (isSame) {
      return;
    } // skip API call

    history.push({
      pathname: location.pathname,
      search: query,
    });
  };

  const resetFilters = () => {
    const empty: Filters = {
      search: '',
      productIds: [],
      createdFromDate: '',
      createdToDate: '',
      institutionTypeIds: [],
      stateIds: [],
      page: 0,
      size: 10,
    };

    setDraftFilters(empty);

    history.push({
      pathname: location.pathname,
      search: '',
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          width: '100%', // stretch to available width
          height: '48px',
        }}
      >
        {filtersConfig.map((filter) => {
        const flexGrow = filter.grow ?? 1;

        if (filter.type === 'text') {
          return (
            <TextField
              key={filter.key}
              size="small"
              label={filter.label}
              value={draftFilters[filter.key as keyof typeof draftFilters]}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  applyFilters();
                }
              }}
              sx={{
                flexGrow,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
              }}
            />
          );
        }

        if (filter.type === 'date') {
          return (
            <DateFilterField
              key={filter.key}
              label={filter.label}
              value={draftFilters[filter.key]}
              onChange={(value) => handleFilterChange(filter.key, value)}
              min={filter.key === 'createdToDate' ? draftFilters.createdFromDate : undefined}
              max={filter.key === 'createdFromDate' ? draftFilters.createdToDate : undefined}
              grow={flexGrow}
            />
          );
        }

        if (filter.type === 'select') {
          return (
            <FormControl
              key={filter.key}
              size="small"
              sx={{
                flexGrow,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <InputLabel>{filter.label}</InputLabel>
              <Select
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    paddingRight: '32px !important',
                    overflow: 'hidden',
                    minWidth: 0,
                  },
                }}
                multiple={filter.multiple}
                value={draftFilters[filter.key] as Array<string>}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                input={<OutlinedInput label={filter.label} />}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 500,

                      '&::-webkit-scrollbar': {
                        width: '15px',
                      },
                      '&::-webkit-scrollbar-track': {
                        boxShadow: 'inset -1px 0px 0px #F0F0F0, inset 1px 0px 0px #E8E8E8',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#C1C1C1',
                        borderRadius: '8px',
                        borderLeft: '3.5px solid transparent',
                        borderRight: '3.5px solid transparent',
                        backgroundClip: 'padding-box',
                      },
                      '&::-webkit-scrollbar-button': {
                        display: 'none',
                      },
                    },
                  },
                }}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                      width: '100%',
                    }}
                  >
                    {(selected as Array<string>)
                      .map((val) => filter.options.find((o) => o.value === val)?.label ?? val)
                      .join(', ')}
                  </Box>
                )}
              >
                {filter.options.map((option) => {
                  const isSelected = Array.isArray(draftFilters[filter.key])
                    ? (draftFilters[filter.key] as Array<string>).includes(option.value)
                    : false;
                  return (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #E8EBF1',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        backgroundColor: 'transparent',
                        '&:hover, &.Mui-selected, &.Mui-focusVisible': {
                          backgroundColor: 'rgba(11, 62, 227, 0.08) !important',
                        },
                        '&.Mui-selected': {
                          color: 'inherit !important',
                        },
                      }}
                    >
                      <span>{option.label}</span>
                      <Checkbox
                        checked={isSelected}
                        icon={
                          <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#0E0F13' }} />
                        }
                        checkedIcon={<CheckBoxIcon fontSize="small" sx={{ color: '#0B3EE3' }} />}
                        disableRipple
                        sx={{
                          padding: 0,
                        }}
                      />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          );
        }

        return null;
      })}

        <Button
          variant="contained"
          onClick={applyFilters}
          size="small"
          sx={{ flexShrink: 0, backgroundColor: '#0B3EE3', borderRadius: '8px' }}
        >
          {t('onboardingsPage.filters.filtersButton')}
        </Button>
        <ButtonNaked
          onClick={resetFilters}
          color="primary"
          size="small"
          sx={{ flexShrink: 0, color: '#0B3EE3' }}
        >
          {t('onboardingsPage.filters.resetButton')}
        </ButtonNaked>
      </Box>
    </LocalizationProvider>
  );
};
