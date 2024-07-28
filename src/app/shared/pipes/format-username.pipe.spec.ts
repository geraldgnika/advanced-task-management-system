import { FormatUsernamePipe } from './format-username.pipe';

describe('FormatUsernamePipe', () => {
  let pipe: FormatUsernamePipe;

  beforeEach(() => {
    pipe = new FormatUsernamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format a username with @ prefix', () => {
    expect(pipe.transform('johndoe')).toBe('@johndoe');
  });

  it('should handle null value', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should handle undefined value', () => {
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should trim leading and trailing spaces', () => {
    expect(pipe.transform(' johndoe ')).toBe('@johndoe');
  });

  it('should handle username with spaces', () => {
    expect(pipe.transform('john doe')).toBe('@john doe');
  });

  it('should not add multiple @ symbols', () => {
    expect(pipe.transform('@@johndoe')).toBe('@johndoe');
  });

  it('should handle username with special characters', () => {
    expect(pipe.transform('john_doe123')).toBe('@john_doe123');
  });

  it('should handle username with only spaces', () => {
    expect(pipe.transform('   ')).toBe('@');
  });
});
