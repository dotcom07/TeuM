/** Node 리뷰 스크립트에서 앱의 확장자 없는 TypeScript import를 해석한다. */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (
      error?.code === "ERR_MODULE_NOT_FOUND" &&
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !specifier.endsWith(".ts") &&
      !specifier.endsWith(".tsx")
    ) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw error;
  }
}
