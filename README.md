# Table schema to Markdown

Generate Markdown documentation from a [table schema](https://frictionlessdata.io/specs/table-schema/) JSON file.

## Dependencies

```bash
npm install
```

## Usage

Given a table schema named `schema.json` (e.g. [this one](https://git.opendatafrance.net/scdl/subventions/blob/master/schema.json)):

```bash
node index.js --locale=fr /path/to/schema.json templates/fr/index.hbs
```
