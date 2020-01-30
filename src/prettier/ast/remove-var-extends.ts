import { Collection } from "jscodeshift/src/Collection";

export default function(root: Collection<any>) {
  root.findVariableDeclarators("__extends").remove();
  return root;
}
