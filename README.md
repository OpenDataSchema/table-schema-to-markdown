# Table schema to Markdown

Generate Markdown documentation from a [table schema](https://frictionlessdata.io/specs/table-schema/) JSON file.

Note: For now table schemas specification doesn't define metadata properties. This project is based on [this proposal](https://github.com/frictionlessdata/specs/pull/630).

## Install

```bash
npm install -g @opendataschema/table-schema-to-markdown
```

## Usage

Given a table schema named `schema.json` (e.g. [this one](https://git.opendatafrance.net/scdl/subventions/blob/master/schema.json)):

```bash
table-schema-to-markdown <schema.json>
LC_ALL=fr table-schema-to-markdown <schema.json>
LC_ALL=fr table-schema-to-markdown --template <template.hbs> <schema.json>
```

## Development

Install project with its dependencies:

```bash
git clone https://framagit.org/opendataschema.org/table-schema-to-markdown.git
cd table-schema-to-markdown
npm install
```

Use it:

```bash
node src/index.js <schema.json>
LC_ALL=fr node src/index.js <schema.json>
LC_ALL=fr node src/index.js --template <template.hbs> <schema.json>
```
