var expect = require("chai").expect;
const j = require("jscodeshift");
const removeVarExtends = require("../lib/prettier/ast/remove-var-extends")
  .default;

describe("remove-var-extends", function() {
  it("remove var __extends with single declarator", function() {
    const result = removeVarExtends(j(`var __extends = 114514;`)).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(``);
  });

  it("remove var __extends with multiple declarator", function() {
    const result = removeVarExtends(
      j(`var __extends = 114514, a = 2, __extends = 1919810, b = false;`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`var a = 2, b = false;`);
  });
});
