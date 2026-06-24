import { describe, it, expect } from 'vitest';
import { parseFilters, serializeFilters, toApiDateTime } from '../filtersUtils';

describe('filtersUtils', () => {
  describe('parseFilters', () => {
    it('should parse URL search params and return default filters when empty', () => {
      const result = parseFilters('');

      expect(result).toEqual({
        search: '',
        productIds: [],
        createdFromDate: '',
        createdToDate: '',
        institutionTypeIds: [],
        stateIds: [],
        includeTest: 'false',
        page: 0,
        size: 10,
      });
    });

    it('should parse search param with text value', () => {
      const result = parseFilters('?search=test');

      expect(result.search).toBe('test');
      expect(result.page).toBe(0);
      expect(result.size).toBe(10);
    });

    it('should parse multiple comma-separated productIds', () => {
      const result = parseFilters('?productIds=prod1,prod2,prod3');

      expect(result.productIds).toEqual(['prod1', 'prod2', 'prod3']);
    });

    it('should parse date filters', () => {
      const result = parseFilters('?createdFromDate=2024-01-01&createdToDate=2024-12-31');

      expect(result.createdFromDate).toBe('2024-01-01');
      expect(result.createdToDate).toBe('2024-12-31');
    });

    it('should parse institution type IDs', () => {
      const result = parseFilters('?institutionTypeIds=PA,GSP,PT');

      expect(result.institutionTypeIds).toEqual(['PA', 'GSP', 'PT']);
    });

    it('should parse state IDs', () => {
      const result = parseFilters('?stateIds=COMPLETED,REJECTED');

      expect(result.stateIds).toEqual(['COMPLETED', 'REJECTED']);
    });

    it('should parse page and size parameters', () => {
      const result = parseFilters('?page=5&size=25');

      expect(result.page).toBe(5);
      expect(result.size).toBe(25);
    });

    it('should parse all parameters together', () => {
      const search = '?search=test&productIds=prod1,prod2&createdFromDate=2024-01-01&createdToDate=2024-12-31&institutionTypeIds=PA&stateIds=COMPLETED&page=2&size=20';
      const result = parseFilters(search);

      expect(result.search).toBe('test');
      expect(result.productIds).toEqual(['prod1', 'prod2']);
      expect(result.createdFromDate).toBe('2024-01-01');
      expect(result.createdToDate).toBe('2024-12-31');
      expect(result.institutionTypeIds).toEqual(['PA']);
      expect(result.stateIds).toEqual(['COMPLETED']);
      expect(result.includeTest).toBe('false');
      expect(result.page).toBe(2);
      expect(result.size).toBe(20);
    });

    it('should handle empty array params', () => {
      const result = parseFilters('?productIds=');

      // When productIds is empty, split returns [''] 
      expect(result.productIds).toEqual(['']);
    });
  });

  describe('serializeFilters', () => {
    it('should serialize filters to URL query string', () => {
      const filters = {
        search: 'test',
        productIds: ['prod1', 'prod2'],
        createdFromDate: '2024-01-01',
        createdToDate: '2024-12-31',
        institutionTypeIds: ['PA', 'GSP'],
        stateIds: ['COMPLETED'],
        includeTest: 'true',
        page: 1,
        size: 20,
      };

      const result = serializeFilters(filters);

      expect(result).toContain('search=test');
      expect(result).toContain('productIds=prod1%2Cprod2');
      expect(result).toContain('includeTest=true');
      expect(result).toContain('page=1');
      expect(result).toContain('size=20');
    });

    it('should omit empty fields from serialization', () => {
      const filters = {
        search: '',
        productIds: [],
        createdFromDate: '',
        createdToDate: '',
        institutionTypeIds: [],
        stateIds: [],
        includeTest: 'false',
        page: 0,
        size: 10,
      };

      const result = serializeFilters(filters);

      expect(result).not.toContain('search=');
      expect(result).not.toContain('productIds=');
      expect(result).toContain('page=0');
      expect(result).toContain('size=10');
    });

    it('should always include page and size parameters', () => {
      const filters = {
        search: '',
        productIds: [],
        createdFromDate: '',
        createdToDate: '',
        institutionTypeIds: [],
        stateIds: [],
        includeTest: 'false',
        page: 0,
        size: 10,
      };

      const result = serializeFilters(filters);

      expect(result).toContain('page=');
      expect(result).toContain('size=');
    });

    it('should handle single element arrays', () => {
      const filters = {
        search: '',
        productIds: ['prod1'],
        createdFromDate: '',
        createdToDate: '',
        institutionTypeIds: [],
        stateIds: ['COMPLETED'],
        includeTest: 'false',
        page: 0,
        size: 10,
      };

      const result = serializeFilters(filters);

      expect(result).toContain('productIds=prod1');
      expect(result).toContain('stateIds=COMPLETED');
    });

    it('should round-trip with parseFilters', () => {
      const original = {
        search: 'test',
        productIds: ['prod1', 'prod2'],
        createdFromDate: '2024-01-01',
        createdToDate: '2024-12-31',
        institutionTypeIds: ['PA'],
        stateIds: ['COMPLETED', 'PENDING'],
        includeTest: 'true',
        page: 1,
        size: 20,
      };

      const serialized = serializeFilters(original);
      const parsed = parseFilters('?' + serialized);

      expect(parsed).toEqual(original);
    });
  });

  describe('toApiDateTime', () => {
    it('should format date as start of day with timezone', () => {
      const result = toApiDateTime('2024-01-15', false);

      expect(result).toBe('2024-01-15T00:00:00Z');
    });

    it('should format date as end of day with timezone', () => {
      const result = toApiDateTime('2024-01-15', true);

      expect(result).toBe('2024-01-15T23:59:59Z');
    });

    it('should return undefined for empty date', () => {
      const result = toApiDateTime('', false);

      expect(result).toBeUndefined();
    });

    it('should handle various date formats correctly', () => {
      const result1 = toApiDateTime('2024-12-31', false);
      const result2 = toApiDateTime('2024-12-31', true);

      expect(result1).toBe('2024-12-31T00:00:00Z');
      expect(result2).toBe('2024-12-31T23:59:59Z');
    });

    it('should return end-of-day time by default when endOfDay is true', () => {
      const result = toApiDateTime('2024-06-15', true);
      expect(result).toContain('23:59:59');
    });
  });
});
