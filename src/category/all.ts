import { Category, CategoryEntry } from "./category";

export const GameMgr = new Category().beginWith("var GameMgr");

export const Categories = [GameMgr];

export class CategoryManager {
  private static count = 0;

  public static getSavePath(code: string): CategoryEntry {
    for (const ca of Categories) {
      if (ca.test(code)) {
        return ca.entry(code);
      }
    }
    return {
      path: "./result",
      filename: `${++CategoryManager.count}.js`
    };
  }
}
