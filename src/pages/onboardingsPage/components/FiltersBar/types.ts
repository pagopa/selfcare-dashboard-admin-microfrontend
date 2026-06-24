export type Filters = {
  search: string;
  productIds: Array<string>;
  createdFromDate: string;
  createdToDate: string;
  institutionTypeIds: Array<string>;
  stateIds: Array<string>;
  includeTest: string;
  page: number;
  size: number;
};

export type FilterConfig =
  | {
      type: 'text';
      key: keyof Filters;
      label: string;
      grow?: number;
    }
  | {
      type: 'select';
      key: keyof Filters;
      label: string;

      options: Array<{ label: string; value: string }>;
      multiple: boolean;
      grow?: number;
    }
  | {
      type: 'date';
      key: 'createdFromDate' | 'createdToDate';
      label: string;
      grow?: number;
    };
