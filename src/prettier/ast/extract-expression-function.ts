import j, { CallExpression, LogicalExpression } from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";

function rename(path, oldName: string, newName: any) {
  var rootScope = path.scope;
  var rootPath = rootScope.path;
  j(rootPath)
    .find(j.Identifier, { name: oldName })
    .filter(function(path) {
      // ignore properties in MemberExpressions
      var parent = path.parent.value;
      return (
        parent.type !== "FunctionExpression" &&
        parent.type !== "AssignmentExpression" &&
        (!j.MemberExpression.check(parent) ||
          parent.property !== path.node ||
          !parent.computed)
      );
    })
    .forEach(function(p) {
      var scope = p.scope;
      while (scope && scope !== rootScope) {
        if (scope.declares(oldName)) {
          return;
        }
        scope = scope.parent;
      }
      if (scope) {
        // identifier must refer to declared variable
        j(p).replaceWith(newName);
      }
    });
}

/**
 *
 * !(function(t) {})(game || (game = {}));
 *
 * @param root
 */
export default function(root: Collection<any>) {
  let path: Collection<any>;
  while (
    ((path = root.find(j.ExpressionStatement).filter(path => {
      const exp = path.node.expression;
      let call: CallExpression;
      if (
        exp.type === "UnaryExpression" &&
        exp.operator === "!" &&
        exp.argument.type === "CallExpression"
      ) {
        call = exp.argument;
      } else if (exp.type === "CallExpression") {
        call = exp;
      } else {
        return false;
      }

      // Not condition in typescript
      if (
        call.arguments.length !== 1 ||
        call.arguments[0].type !== "LogicalExpression"
      )
        return false;

      const logical = call.arguments[0];
      return (
        logical.operator === "||" &&
        logical.right.type === "AssignmentExpression" &&
        logical.right.operator === "=" &&
        logical.right.right.type === "ObjectExpression" &&
        logical.right.right.properties.length === 0
      );
    })),
    path.length > 0)
  ) {
    const call = path.find(j.CallExpression).paths()[0].value;
    const func = path.find(j.FunctionExpression).paths()[0];

    // Rename parameter
    const from = call.callee["params"][0]["name"];
    const to = (call.arguments[0] as LogicalExpression).left;
    rename(func, from, to);

    // Replace
    path.replaceWith([
      j.expressionStatement(
        j.logicalExpression(
          "||",
          to,
          j.assignmentExpression("=", to, j.objectExpression([]))
        )
      ),
      ...func.value.body.body
    ]);
  }

  return root;
}
