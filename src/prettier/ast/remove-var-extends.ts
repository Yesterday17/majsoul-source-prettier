import j, { VariableDeclarator, Identifier } from "jscodeshift";
import { Collection, fromPaths } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  const id = root
    .find(j.VariableDeclaration)
    .filter(
      path =>
        ((path.node.declarations[0] as VariableDeclarator).id as Identifier)
          .name === "__extends"
    )
    .forEach(path => {
      const root = fromPaths([path]) as Collection<any>;
      const dec = root.find(j.VariableDeclaration);
      (dec.length === 0
        ? root
        : root.findVariableDeclarators("__extends")
      ).remove();
    });
}
