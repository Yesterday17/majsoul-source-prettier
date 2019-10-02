import putout from 'putout';

export default function(code: string) {
  return putout(code, {
    plugins: [
      // 'extract-sequence-expressions',
      'remove-nested-blocks',
      'remove-double-negations',
      'split-variable-declarations',
      'simplify-ternary',
      'apply-shorthand-properties'
    ]
  }).code;
}
