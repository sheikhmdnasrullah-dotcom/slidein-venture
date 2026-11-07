// Conservative optimisation: the logos are already baked paths, so this only trims numbers, whitespace and
// redundant attributes. Ids, <title>, role and aria-labelledby are kept (accessibility + editability);
// viewBox and path geometry precision (2 decimals) are not touched.
export default {
  multipass: true,
  floatPrecision: 2,
  plugins: [{ name: 'preset-default', params: { overrides: { cleanupIds: false, removeViewBox: false, removeTitle: false, removeUnknownsAndDefaults: { keepRoleAttr: true, keepAriaAttrs: true }, mergePaths: false, collapseGroups: true } } }],
};
