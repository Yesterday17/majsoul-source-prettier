import { transform } from "lebab";

export default function(code: string) {
  return transform(code, [
    "for-of",
    "for-each",
    "arg-rest",
    "arg-spread",
    "obj-method",
    "obj-shorthand",
    "no-strict",
    "exponent",
    "multi-var",
    "class",
    "template",
    "default-param",
    "includes"
  ]).code;
}
