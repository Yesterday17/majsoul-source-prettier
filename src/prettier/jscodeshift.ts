import j from "jscodeshift";
import removeSequencedExpression from "./ast/remove-sequenced-expression";
import removeVarExtends from "./ast/remove-var-extends";
import extractExpressionFunction from "./ast/extract-expression-function";

export function before(code: string): string {
  const ast = j(code);
  removeSequencedExpression(ast);
  removeVarExtends(ast);
  extractExpressionFunction(ast);
  return ast.toSource();
}

export function after(code: string): string {
  return code;
}
