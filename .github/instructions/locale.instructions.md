---
applyTo: "src/locale/**"
---

# Locale files

- Only `it.ts` exists: a default-exported nested object registered into the host i18n by `configureI18n` in `locale-utils.ts` (`addResourceBundle('it', 'translation', it, true)`).
- Keys are camelCase and grouped by feature/page/component.
- Use i18next interpolation (`{{name}}`) for dynamic values.
- Do not hardcode user-facing strings in components; add them here and use `t()`.
- If more languages are introduced, every key must exist in all of them with identical nesting and placeholders.
