import j from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

type acceptedOperator = "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=";
const map = {
  "!": "!",
  "=": "=",
  "<": ">",
  ">": "<"
};

function revert(op: string) {
  return op
    .split("")
    .map(t => map[t])
    .join("") as acceptedOperator;
}

export default function(root: Collection<any>) {
  // 0 op a -> a op(revert) 0
  root
    .find(j.BinaryExpression, { left: { type: "Literal" } })
    .filter(path =>
      ["==", "!=", "===", "!==", "<", "<=", ">", ">="].includes(
        path.value.operator
      )
    )
    .replaceWith(p =>
      j.binaryExpression(revert(p.value.operator), p.value.right, p.value.left)
    );
  return root;
}
