import j, { UnaryExpression, CallExpression, Identifier } from "jscodeshift";
import { Collection, fromPaths } from "jscodeshift/src/Collection";

function rename(path, oldName: string, newName: string) {
  var rootScope = path.scope;
  var rootPath = rootScope.path;
  fromPaths([rootPath])
    .find(j.Identifier, { name: oldName })
    .filter(function(path) {
      // ignore properties in MemberExpressions
      var parent = path.parent.node;
      return (
        !j.MemberExpression.check(parent) ||
        parent.property !== path.node ||
        !parent.computed
      );
    })
    .forEach(function(path) {
      var scope = path.scope;
      while (scope && scope !== rootScope) {
        if (scope.declares(oldName)) {
          return;
        }
        scope = scope.parent;
      }
      if (scope) {
        // identifier must refer to declared variable
        path.get("name").replace(newName);
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
  root
    .find(j.ExpressionStatement, {
      expression: {
        type: "UnaryExpression",
        operator: "!",
        argument: {
          type: "CallExpression"
        }
      }
    })
    .filter(path => {
      const exp = (path.node.expression as UnaryExpression)
        .argument as CallExpression;
      if (
        exp.arguments.length != 1 ||
        exp.arguments[0].type !== "LogicalExpression"
      )
        return false;
      const logical = exp.arguments[0];
      return (
        logical.operator === "||" &&
        logical.left.type === "Identifier" &&
        logical.right.type === "AssignmentExpression" &&
        logical.right.operator === "=" &&
        logical.right.left.type === "Identifier" &&
        logical.right.right.type === "ObjectExpression" &&
        logical.right.right.properties.length === 0
      );
    })
    .forEach(path => {
      const root = fromPaths([path]) as Collection<any>;
      const func = root.find(j.FunctionExpression).paths()[0];
      const logi = root
        .find(j.LogicalExpression, { operator: "||" })
        .paths()
        .reverse()[0];

      // Rename parameter
      const from = (func.node.params[0] as Identifier).name;
      const to = fromPaths([logi])
        .find(j.Identifier)
        .paths()[0].value.name;
      rename(func, from, to);

      // Initialization
      path.insertBefore(`${to} || (${to} = {});`);
      // Extract out
      func.node.body.body.forEach(st => path.insertBefore(st));
    })
    .remove();
}
