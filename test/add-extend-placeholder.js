var expect = require("chai").expect;
const j = require("jscodeshift");
const addExtendPlaceholder = require("../lib/prettier/ast/add-extend-placeholder")
  .default;

describe("add-extend-placeholder", function() {
  it("add placeholder", function() {
    const result = addExtendPlaceholder(
      j(`function a() {}
__extends(a, f)`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`function a() {}
__extends(a, f)
a.prototype.__placeholder__ = function() {}`);
  });
});
