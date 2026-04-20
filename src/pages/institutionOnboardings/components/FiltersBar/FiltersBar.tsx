import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { getFiltersConfig } from './filtersConfig';
import { parseFilters, serializeFilters } from './filtersUtils';

export const FiltersBar = () => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const products = [];
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
    const query = serializeFilters(draftFilters);
    const current = parseFilters(location.search);

    const isSame = JSON.stringify(current) === JSON.stringify(draftFilters);

    if (isSame) {
      return;
    } // skip API call

    history.push({
      pathname: location.pathname,
      search: query,
    });
  };

  const resetFilters = () => {
    const empty: typeof draftFilters = {
      search: '',
      productIds: [],
      institutionTypeIds: [],
      stateIds: [],
    };

    setDraftFilters(empty);

    history.push({
      pathname: location.pathname,
      search: '',
    });
  };

  return (
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
              value={draftFilters[filter.key as keyof typeof draftFilters] as string}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              sx={{
                flexGrow,
                flexShrink: 1,
                flexBasis: 0,
                minWidth: 0,
              }}
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
                  '& .MuiOutlinedInput-root': {
                    overflow: 'hidden',
                  },
                }}
                multiple={filter.multiple}
                value={draftFilters[filter.key] as Array<string>}
                onChange={(e) => handleFilterChange(filter.key, e.target.value as Array<string>)}
                input={<OutlinedInput label={filter.label} />}
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
                    {selected.join(', ')}
                  </Box>
                )}
              >
                {filter.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        return null;
      })}

      <Button variant="contained" onClick={applyFilters} size="small" sx={{ flexShrink: 0 }}>
        {t('institutionOnboardings.filters.filtersButton')}
      </Button>
      <Button onClick={resetFilters} color="primary" size="small" sx={{ flexShrink: 0 }}>
        {t('institutionOnboardings.filters.resetButton')}
      </Button>
    </Box>
  );
};
