# Evidence

**Author:** Colin Dixon

This directory is the receipt drawer. Files committed here, not dates typed in frontmatter, are the immutable timestamps.

## Layout

```
evidence/
  YYYY/
    <slug>/
      README.md     optional capture notes
      source.png    or .html / .pdf / .md
```

An entry’s `evidence.path` points at the main file, relative to this directory:

```yaml
evidence:
  path: 2024/format-gina-puppet/source.md
  kind: note
```

`npm run dev` and `npm run build` copy this tree to `public/evidence/` so the site can serve `/evidence/...`. The copy is gitignored. Edit files **here**.

## Rules

- Capture the original source, not a quote-tweet of a screenshot of a quote-tweet.
- Do not rewrite a finished capture in place. Add a new file and mention it.
- Optional Archive.org / archive.is URL belongs on the entry (`evidence.archiveUrl`), not instead of this file.
- Format-example stubs live under `evidence/2024/` and should be replaced before launch.

See [docs/CONTENT-MODEL.md](../docs/CONTENT-MODEL.md).
