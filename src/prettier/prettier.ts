import prettier from 'prettier';

export default function(code: string) {
  return prettier.format(code, {
    semi: true,
    arrowParens: 'avoid',
    singleQuote: true,
    tabWidth: 2,
    endOfLine: 'lf',
    parser: 'babel'
  });
}
