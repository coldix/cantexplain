# Evidence

**Author:** Colin Dixon

This directory is the receipt drawer. Files committed here, not dates typed in frontmatter, are the immutable timestamps.

## Layout

```
evidence/
  YYYY/
    <slug>/
      source.md     capture notes (usual `evidence.path`)
      *.html / *.pdf / *.png
```

An entry’s `evidence.path` points at the main file, relative to this directory:

```yaml
evidence:
  path: 2010/no-carbon-tax/source.md
  kind: html
```

`npm run dev` and `npm run build` copy this tree to `public/evidence/` so the site can serve `/evidence/...`. The copy is gitignored. Edit files **here**.

## Rules

- Capture the original source, not a quote-tweet of a screenshot of a quote-tweet.
- Do not rewrite a finished capture in place. Add a new file and mention it.
- Optional Archive.org / archive.is URL belongs on the entry (`evidence.archiveUrl`), not instead of this file.
- Do not duplicate a large capture across slugs. Point at the existing file from `source.md`.

See [docs/CONTENT-MODEL.md](../docs/CONTENT-MODEL.md).
