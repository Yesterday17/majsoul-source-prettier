var expect = require("chai").expect;
const j = require("jscodeshift");
const extractExpressionFunction = require("../lib/prettier/ast/extract-expression-function")
  .default;

describe("extract-expression-function", function() {
  it("extract identifier", function() {
    const result = extractExpressionFunction(
      j(`(function(t) { t.a = 1; })(game || (game = {}));`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`game || (game = {});
game.a = 1;`);
  });

  it("extract member expression", function() {
    const result = extractExpressionFunction(
      j(`(function(t) { t.a = 1; })(game.test || (game.test = {}));`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`game.test || (game.test = {});
game.test.a = 1;`);
  });

  it("extract call surrounded with unary expression", function() {
    const result = extractExpressionFunction(
      j(`!(function(t) { t.a = 1; })(game || (game = {}));`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`game || (game = {});
game.a = 1;`);
  });

  it("extranested call", function() {
    const result = extractExpressionFunction(
      j(`!(function(t) {
t.a = 1;
!(function(g) {
g.f = true;
})(t.d || (t.d = {}));
})(game.test || (game.test = {}));`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`game.test || (game.test = {});
game.test.a = 1;
game.test.d || (game.test.d = {});
game.test.d.f = true;`);
  });
});
