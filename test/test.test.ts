// describe("function test", () => {
//   it("handleExcludes", () => {
//     const hooks = handleExcludes(
//       {
//         a() {},
//         b() {},
//         c() {},
//       },
//       ["a", "b"]
//     );

//     expect(hooks).toStrictEqual(["c"]);
//     expect(hooks.length).toBe(1);
//   });

//   it("handleIncludes", () => {
//     const hooks = handleIncludes(
//       {
//         a() {},
//         b() {},
//         c() {},
//       },
//       ["a", "b"]
//     );

//     expect(hooks).toStrictEqual(["a", "b"]);
//     expect(hooks.length).toBe(2);
//   });
// });
