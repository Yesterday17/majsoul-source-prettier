const expect = require("chai").expect;
const j = require("jscodeshift");
const binarySequenceSwitch = require("../lib/prettier/ast/binary-sequence-switch")
  .default;

describe("binary-sequence-switch", function() {
  it("should switch when sequence is not correct", function() {
    const result = binarySequenceSwitch(j(`2 == i`)).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`i == 2`);
  });

  it("should not switch when sequence is correct", function() {
    const result = binarySequenceSwitch(j(`i == 2`)).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`i == 2`);
  });

  it("should reverse operator", function() {
    const result = binarySequenceSwitch(j(`2 < i`)).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`i > 2`);
  });

  it("should switch every incorrect sequence", function() {
    const result = binarySequenceSwitch(
      j(`2 == i || i == 4 && 3 >= i`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`i == 2 || i == 4 && i <= 3`);
  });

  it("should work in if statement", function() {
    const result = binarySequenceSwitch(j(`if (2 == i) i++`)).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`if (i == 2) i++`);
  });

  it("should work in for statement", function() {
    const result = binarySequenceSwitch(
      j(`for (var i = 0;10 !== i;i++) {}`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`for (var i = 0;i !== 10;i++) {}`);
  });

  it("should work in conditional expression", function() {
    const result = binarySequenceSwitch(
      j(`5 <= i ? 10 !== i : 2 > j`)
    ).toSource();
    expect(result).to.be.a("string");
    expect(result).equal(`i >= 5 ? i !== 10 : j < 2`);
  });
});
