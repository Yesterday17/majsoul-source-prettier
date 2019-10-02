import j from 'jscodeshift';
import removeSequencedExpression from './ast/remove-sequenced-expression';

export default function(code: string) {
  const ast = j(code);
  removeSequencedExpression(ast);
  return ast.toSource();
}
