import LexicalError from './LexicalError';

describe('Lexical Error Class Test', () => {
  it('Should throw a Lexical Error', () => {
    const t = () => {
      throw new LexicalError('LEXICAL ERROR TEST');
    };
    expect(t).toThrow('LEXICAL ERROR TEST');
  });
});
