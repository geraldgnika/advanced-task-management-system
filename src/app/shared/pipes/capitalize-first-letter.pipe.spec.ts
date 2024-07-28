import { CapitalizeFirstLetterPipe } from './capitalize-first-letter.pipe';

describe('CapitalizeFirstLetterPipe', () => {
  let pipe: CapitalizeFirstLetterPipe;

  beforeEach(() => {
    pipe = new CapitalizeFirstLetterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should capitalize the first letter of a single word', () => {
    expect(pipe.transform('hello')).toBe('Hello');
  });

  it('should capitalize the first letter of each word in a sentence', () => {
    expect(pipe.transform('hello world')).toBe('Hello World');
  });

  it('should handle already capitalized words', () => {
    expect(pipe.transform('HELLO WORLD')).toBe('Hello World');
  });

  it('should handle mixed case words', () => {
    expect(pipe.transform('hElLo WoRlD')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle null value', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should handle undefined value', () => {
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should handle string with special characters', () => {
    expect(pipe.transform('hello-world')).toBe('Hello-world');
  });
});
