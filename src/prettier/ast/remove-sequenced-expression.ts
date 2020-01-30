import j from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  let f: Collection<any>;
  while (((f = root.find(j.SequenceExpression)), f.length > 0)) {
    const path = f.paths()[0];
    const exps = path.value.expressions;
    const parent = (() => {
      let p = path.parent;
      while (
        p.parent.node.type !== "BlockStatement" &&
        p.parent.node.type !== "Program"
      ) {
        p = p.parent;
      }
      return p;
    })();

    exps.forEach((e, index: number) => {
      try {
        if (index !== exps.length - 1) {
          j(parent).insertBefore(j.expressionStatement(e));
        } else {
          j(path).replaceWith(e);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }
  return root;
}
