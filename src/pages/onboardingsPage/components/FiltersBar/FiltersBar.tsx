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
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Product } from '../../../../model/Product';
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
                borderRadius: '8px',
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
                borderRadius: '8px',
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
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 400,
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
  );
};
