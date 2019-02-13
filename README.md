# Table schema to Markdown

Generate Markdown documentation from a [table schema](https://frictionlessdata.io/specs/table-schema/) JSON file.

## Dependencies

```bash
npm install
```

## Usage

Given a table schema named `schema.json` (e.g. [this one](https://git.opendatafrance.net/scdl/subventions/blob/master/schema.json)):

```bash
node index.js /path/to/schema.json
LANG=fr node index.js /path/to/schema.json
LANG=fr node index.js --template template.hbs /path/to/schema.json
```

## Custom templates

- see templates/fr/partials/fieldsAsTable.hbs
