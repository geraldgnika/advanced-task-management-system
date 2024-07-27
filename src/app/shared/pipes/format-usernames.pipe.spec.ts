import { FormatUsernamesPipe } from './format-usernames.pipe';

describe('FormatUsernamesPipe', () => {
  let pipe: FormatUsernamesPipe;

  beforeEach(() => {
    pipe = new FormatUsernamesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an empty string for null input', () => {
    expect(pipe.transform([])).toBe('');
  });

  it('should return an empty string for undefined input', () => {
    expect(pipe.transform([])).toBe('');
  });

  it('should return an empty string for non-array input', () => {
    expect(pipe.transform('not an array' as any)).toBe('');
  });

  it('should format a single username', () => {
    expect(pipe.transform(['john'])).toBe('@john');
  });

  it('should format multiple usernames', () => {
    expect(pipe.transform(['john', 'jane', 'doe'])).toBe('@john, @jane, @doe');
  });

  it('should trim usernames', () => {
    expect(pipe.transform(['  john  ', ' jane ', 'doe  '])).toBe('@john, @jane, @doe');
  });

  it('should handle an empty array', () => {
    expect(pipe.transform([])).toBe('');
  });
});