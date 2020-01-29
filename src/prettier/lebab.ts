import { transform } from "lebab";

export default function(code: string) {
  return transform(code, [
    // 'arrow',
    // 'arrow-return',
    "for-of",
    "for-each",
    "arg-rest",
    "arg-spread",
    "obj-method",
    "obj-shorthand",
    "no-strict",
    "exponent",
    "multi-var",
    // 'let',
    "class",
    // 'commonjs',
    "template",
    "default-param",
    "destruct-param",
    "includes"
  ]).code;
}
