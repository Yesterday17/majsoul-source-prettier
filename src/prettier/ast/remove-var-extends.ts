import j, { VariableDeclarator, Identifier } from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  root
    .find(j.VariableDeclaration)
    .filter(
      path =>
        ((path.node.declarations[0] as VariableDeclarator).id as Identifier)
          .name === "__extends"
    )
    .forEach(path => {
      const root = j(path);
      const dec = root.find(j.VariableDeclaration);
      (dec.length === 0
        ? root
        : root.findVariableDeclarators("__extends")
      ).remove();
    });
}
