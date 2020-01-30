import j from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  // void 0 -> undefined
  root
    .find(j.UnaryExpression, { operator: "void", argument: { value: 0 } })
    .replaceWith(j.identifier("undefined"));

  // !0 -> true
  root
    .find(j.UnaryExpression, { operator: "!", argument: { value: 0 } })
    .replaceWith(j.literal(true));

  // !1 -> false
  root
    .find(j.UnaryExpression, { operator: "!", argument: { value: 1 } })
    .replaceWith(j.literal(false));

  return root;
}
