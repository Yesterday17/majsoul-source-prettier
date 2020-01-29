import prettier from "prettier";

export default function(code: string) {
  return prettier.format(code, {
    semi: true,
    arrowParens: "always",
    singleQuote: true,
    tabWidth: 2,
    endOfLine: "lf",
    parser: "babel"
  });
}
