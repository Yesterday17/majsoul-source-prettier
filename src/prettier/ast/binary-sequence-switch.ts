import j from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  // 0 op a -> a op 0
  root
    .find(j.BinaryExpression, { left: { type: "Literal" } })
    .filter(path =>
      ["==", "!=", "===", "!==", "<", "<=", ">", ">="].includes(
        path.value.operator
      )
    )
    .replaceWith(p =>
      j.binaryExpression(p.value.operator, p.value.right, p.value.left)
    );
}
