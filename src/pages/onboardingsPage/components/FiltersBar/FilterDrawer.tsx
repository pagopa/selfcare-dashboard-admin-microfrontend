import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ButtonNaked } from '@pagopa/mui-italia';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Product } from '../../../../model/Product';
import { DateFilterField } from './DateFilterField';
import { getFiltersConfig } from './filtersConfig';
import { parseFilters, serializeFilters } from './filtersUtils';
import { FilterConfig, Filters } from './types';

dayjs.locale({
  ...dayjs.Ls.it,
  weekStart: 0,
  weekdaysMin: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
});

type Props = {
  products: Array<Product>;
};

export const FilterDrawer = ({ products }: Props) => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const filtersConfig = getFiltersConfig(t, products);

  const [open, setOpen] = useState(false);
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

    if (!isSame) {
      history.push({
        pathname: location.pathname,
        search: query,
      });
    }
    setOpen(false);
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
    setOpen(false);
  };

  const currentFilters = parseFilters(location.search);
  let activeCount = 0;
  if (currentFilters.search) activeCount++;
  if (currentFilters.productIds.length > 0) activeCount++;
  if (currentFilters.institutionTypeIds.length > 0) activeCount++;
  if (currentFilters.stateIds.length > 0) activeCount++;
  if (currentFilters.createdFromDate || currentFilters.createdToDate) activeCount++;

  const textFilters = filtersConfig.filter((f) => f.type === 'text') as Array<Extract<FilterConfig, { type: 'text' }>>;
  const selectFiltersBeforeDate = filtersConfig.filter((f) => f.type === 'select' && f.key !== 'stateIds') as Array<Extract<FilterConfig, { type: 'select' }>>;
  const dateFilters = filtersConfig.filter((f) => f.type === 'date') as Array<Extract<FilterConfig, { type: 'date' }>>;
  const stateFilter = filtersConfig.find((f) => f.key === 'stateIds') as Extract<FilterConfig, { type: 'select' }> | undefined;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <ButtonNaked
          color="primary"
          onClick={() => setOpen(true)}
          startIcon={<FilterAltIcon />}
          sx={{ color: '#0B3EE3', fontWeight: 'bold' }}
        >
          {t('onboardingsPage.filters.filtersButton')} ({activeCount})
        </ButtonNaked>
      </Box>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 417,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {t('onboardingsPage.filters.title')}
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon sx={{ color: '#0E0F13' }} />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Text Filters */}
            {textFilters.map((filter) => (
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
                fullWidth
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              />
            ))}

            {/* Select Filters Before Date */}
            {selectFiltersBeforeDate.map((filter) => (
              <FormControl
                key={filter.key}
                size="small"
                fullWidth
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  multiple={filter.multiple}
                  value={draftFilters[filter.key as keyof typeof draftFilters] as Array<string>}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  IconComponent={KeyboardArrowDownIcon}
                  input={<OutlinedInput label={filter.label} />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 500,
                        '&::-webkit-scrollbar': { width: '15px' },
                        '&::-webkit-scrollbar-track': { boxShadow: 'inset -1px 0px 0px #F0F0F0, inset 1px 0px 0px #E8E8E8' },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#C1C1C1',
                          borderRadius: '8px',
                          borderLeft: '3.5px solid transparent',
                          borderRight: '3.5px solid transparent',
                          backgroundClip: 'padding-box',
                        },
                        '&::-webkit-scrollbar-button': { display: 'none' },
                      },
                    },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(selected as Array<string>)
                        .map((val) => filter.options?.find((o) => o.value === val)?.label ?? val)
                        .join(', ')}
                    </Box>
                  )}
                >
                  {filter.options?.map((option) => {
                    const isSelected = Array.isArray(draftFilters[filter.key as keyof typeof draftFilters])
                      ? (draftFilters[filter.key as keyof typeof draftFilters] as Array<string>).includes(option.value)
                      : false;
                    return (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '8px',
                          borderBottom: '1px solid #E8EBF1',
                          '&:last-child': { borderBottom: 'none' },
                          '&:hover, &.Mui-selected, &.Mui-focusVisible': {
                            backgroundColor: 'rgba(11, 62, 227, 0.08) !important',
                          },
                        }}
                      >
                        <span>{option.label}</span>
                        <Checkbox
                          checked={isSelected}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#0E0F13' }} />}
                          checkedIcon={<CheckBoxIcon fontSize="small" sx={{ color: '#0B3EE3' }} />}
                          disableRipple
                          sx={{ padding: 0 }}
                        />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            ))}

            {/* Date Filters Group */}
            {dateFilters.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                    {t('onboardingsPage.filters.requestDate')}
                  </Typography>
                  <Tooltip title={t('onboardingsPage.filters.requestDateTooltip')} placement="top">
                    <IconButton size="small" sx={{ p: 0 }}>
                      <InfoOutlinedIcon fontSize="small" sx={{ color: '#0B3EE3' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dateFilters.map((filter) => (
                    <DateFilterField
                      key={filter.key}
                      label={filter.label}
                      value={draftFilters[filter.key as keyof typeof draftFilters] as string}
                      onChange={(value) => handleFilterChange(filter.key, value)}
                      min={filter.key === 'createdToDate' ? draftFilters.createdFromDate as string : undefined}
                      max={filter.key === 'createdFromDate' ? draftFilters.createdToDate as string : undefined}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* State Filter After Date */}
            {stateFilter && (
              <FormControl
                key={stateFilter.key}
                size="small"
                fullWidth
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <InputLabel>{stateFilter.label}</InputLabel>
                <Select
                  multiple={stateFilter.multiple}
                  value={draftFilters[stateFilter.key as keyof typeof draftFilters] as Array<string>}
                  onChange={(e) => handleFilterChange(stateFilter.key, e.target.value)}
                  IconComponent={KeyboardArrowDownIcon}
                  input={<OutlinedInput label={stateFilter.label} />}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 500,
                        '&::-webkit-scrollbar': { width: '15px' },
                        '&::-webkit-scrollbar-track': { boxShadow: 'inset -1px 0px 0px #F0F0F0, inset 1px 0px 0px #E8E8E8' },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#C1C1C1',
                          borderRadius: '8px',
                          borderLeft: '3.5px solid transparent',
                          borderRight: '3.5px solid transparent',
                          backgroundClip: 'padding-box',
                        },
                        '&::-webkit-scrollbar-button': { display: 'none' },
                      },
                    },
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(selected as Array<string>)
                        .map((val) => stateFilter.options?.find((o) => o.value === val)?.label ?? val)
                        .join(', ')}
                    </Box>
                  )}
                >
                  {stateFilter.options?.map((option) => {
                    const isSelected = Array.isArray(draftFilters[stateFilter.key as keyof typeof draftFilters])
                      ? (draftFilters[stateFilter.key as keyof typeof draftFilters] as Array<string>).includes(option.value)
                      : false;
                    return (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '8px',
                          borderBottom: '1px solid #E8EBF1',
                          '&:last-child': { borderBottom: 'none' },
                          '&:hover, &.Mui-selected, &.Mui-focusVisible': {
                            backgroundColor: 'rgba(11, 62, 227, 0.08) !important',
                          },
                        }}
                      >
                        <span>{option.label}</span>
                        <Checkbox
                          checked={isSelected}
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: '#0E0F13' }} />}
                          checkedIcon={<CheckBoxIcon fontSize="small" sx={{ color: '#0B3EE3' }} />}
                          disableRipple
                          sx={{ padding: 0 }}
                        />
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Drawer Footer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              p: 3,
              backgroundColor: '#FFFFFF',
            }}
          >
            <ButtonNaked
              onClick={resetFilters}
              color="primary"
              size="small"
              sx={{ color: '#0B3EE3', fontWeight: 'bold' }}
            >
              {t('onboardingsPage.filters.cancelFiltersButton')}
            </ButtonNaked>
            <Button
              variant="contained"
              onClick={applyFilters}
              size="small"
              sx={{ backgroundColor: '#0B3EE3', borderRadius: '8px', px: 4 }}
            >
              {t('onboardingsPage.filters.filtersButton')}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};
