interface CodeObject {
  laya: string;
  majsoul: MajsoulCodeObject;
}

interface MajsoulCodeObject {
  full: string;
  split: string[];
  before: string[];
  lebab: string[];
  after: string[];
}

export default function(code: string): CodeObject {
  const majsoul_start = code.indexOf("var uiscript;");

  const laya = code.substr(0, majsoul_start);
  const majsoul = code.substr(majsoul_start);
  const majsoul_splitted = majsoul
    .split("\nvar")
    .map((code, index) => (index == 0 ? code : "var" + code));
  return {
    laya,
    majsoul: {
      full: majsoul,
      split: majsoul_splitted,
      before: undefined,
      lebab: undefined,
      after: undefined
    }
  };
}
