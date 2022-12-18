// テストフレームワーク jest の設定
// cf. https://jestjs.io/ja/docs/configuration

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // TypeScript のテストのために ts-jest を使う。
  // ts-jest の提供する設定プリセットを使う。
  preset: "ts-jest",

  // テストファイルを検索するディレクトリを指定する。
  roots: ["<rootDir>/src"],
};
