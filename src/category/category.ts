export interface CategoryEntry {
  path: string;
  filename: string;
}

export class Category {
  private begin: string = undefined;
  private end: string = undefined;
  private regex: RegExp = undefined;
  private pathStr: string = "";

  beginWith(begin: string): Category {
    this.begin = begin;
    return this;
  }

  endsWith(end: string): Category {
    this.end = end;
    return this;
  }

  match(regex: RegExp): Category {
    this.regex = regex;
    return this;
  }

  path(path: string): Category {
    this.pathStr = path;
    return this;
  }

  test(code: string): boolean {
    let result = true,
      usage = 0;
    if (this.begin) {
      result = result && code.startsWith(this.begin);
      usage++;
    }
    if (this.end) {
      result = result && code.endsWith(this.end);
      usage++;
    }
    if (this.regex) {
      result = result && this.regex.test(code);
      usage++;
    }
    if (usage === 0) {
      result = false;
    }
    return result;
  }

  entry(code: string): CategoryEntry {
    return {
      path: this.pathStr,
      filename: ""
    };
  }
}
