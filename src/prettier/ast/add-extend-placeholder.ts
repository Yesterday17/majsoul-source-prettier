import j, { Identifier } from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  root
    .find(j.CallExpression, { callee: { name: "__extends" } })
    .forEach(path => {
      j(path.parent).insertAfter(
        `${
          (path.value.arguments[0] as Identifier).name
        }.prototype.__placeholder__ = function() {}`
      );
    });
  return root;
}
