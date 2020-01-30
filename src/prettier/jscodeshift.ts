import j from "jscodeshift";
import removeSequencedExpression from "./ast/remove-sequenced-expression";
import removeVarExtends from "./ast/remove-var-extends";
import extractExpressionFunction from "./ast/extract-expression-function";
import fixClassExtend from "./ast/fix-class-extend";
import commonConstantReplace from "./ast/common-constant-replace";
import binarySequenceSwitch from "./ast/binary-sequence-switch";
import addExtendPlaceholder from "./ast/add-extend-placeholder";

export function before(code: string): string {
  const ast = j(code);
  commonConstantReplace(ast);
  binarySequenceSwitch(ast);

  removeSequencedExpression(ast);
  addExtendPlaceholder(ast);
  removeVarExtends(ast);
  extractExpressionFunction(ast);
  return ast.toSource();
}

export function after(code: string): string {
  const ast = j(code);
  fixClassExtend(ast);
  return ast.toSource();
}
