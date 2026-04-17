type Filters = {
  search: string;
  productIds: Array<string>;
  institutionTypeIds: Array<string>;
  stateIds: Array<string>;
};

type FilterConfig =
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
    };
