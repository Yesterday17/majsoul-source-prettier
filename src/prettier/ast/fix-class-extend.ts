import j, {
  Identifier,
  ASTPath,
  LogicalExpression,
  ExpressionStatement,
  CallExpression
} from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

function generateSuperExpressionStatement(
  path: ASTPath<LogicalExpression>
): ExpressionStatement {
  const args = (path.node.left as CallExpression).arguments.splice(1);
  return j.expressionStatement(j.callExpression(j.super(), args));
}

export default function(root: Collection<any>) {
  root
    .find(j.CallExpression, { callee: { name: "__extends" } })
    .forEach(path => {
      const clz = (path.node.arguments[0] as Identifier).name;
      const base = (path.node.arguments[1] as Identifier).name;

      // Add superClass
      const cls = j(path.parent.parent);
      cls.find(j.ClassDeclaration, { id: { name: clz } }).replaceWith(path => {
        return j.classDeclaration(
          path.node.id,
          path.node.body,
          j.identifier(base)
        );
      });

      // Remove extend in constructor
      cls
        .find(j.MethodDefinition, { key: { name: "constructor" } })
        .forEach(path => {
          const block = j(path.value.value.body);
          const ret = block.find(j.ReturnStatement);

          // A. return base.call(this, arguments...) || this
          if (ret.paths()[0].value.argument.type === "LogicalExpression") {
            ret.replaceWith(
              generateSuperExpressionStatement(
                ret.find(j.LogicalExpression).paths()[0]
              )
            );
          } else {
            // B. var i = base.call(this, arguments...) || this
            //    return i
            let id: string;
            block
              .find(j.VariableDeclarator, {
                id: { type: "Identifier" },
                init: {
                  type: "LogicalExpression",
                  right: { type: "ThisExpression" }
                }
              })
              .forEach(path => {
                const vd = j(path.parent);
                id = (path.value.id as Identifier).name;

                vd.replaceWith(
                  generateSuperExpressionStatement(
                    vd.find(j.LogicalExpression).paths()[0]
                  )
                );
              });
            block
              .find(j.Identifier, { name: id })
              .replaceWith(j.thisExpression());
            block.find(j.ReturnStatement).remove();
          }
        });

      // Remove __extends
      j(path).remove();
    });
}
