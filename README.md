# Table Schema to Markdown

[![npm](https://img.shields.io/npm/v/@opendataschema/table-schema-to-markdown.svg)](https://www.npmjs.com/package/@opendataschema/table-schema-to-markdown)

Generate Markdown documentation from a [Table Schema](https://frictionlessdata.io/specs/table-schema/) JSON file.

Note: For now Table Schemas specification doesn't define metadata properties. This project is based on [this proposal](https://github.com/frictionlessdata/specs/pull/630).

## Install

```bash
npm install -g @opendataschema/table-schema-to-markdown
```

## Usage

A schema can be passed by file path or by URL. Examples:

```bash
table-schema-to-markdown schema.json
table-schema-to-markdown https://git.opendatafrance.net/scdl/subventions/raw/master/schema.json
```

By default, fields are rendered as headings, but it is possible to render them as a table:

```bash
table-schema-to-markdown --fields-format=table schema.json
```

The program reads your current locale to output translated messages, but it's possible to pass another locale:

```bash
LC_ALL=fr table-schema-to-markdown schema.json
```

Another Handlebars template file or partials directory can be passed also:

```bash
table-schema-to-markdown --template my_template.hbs --partials my_partials_dir schema.json
```

## Example

For [this schema](https://git.opendatafrance.net/scdl/subventions/blob/4696b0ad124bf2b73b34534862dace35643d4a9a/schema.json), see [this rendering](https://git.opendatafrance.net/scdl/subventions/blob/4696b0ad124bf2b73b34534862dace35643d4a9a/schema.md).

## Development

Install project with its dependencies:

```bash
git clone https://framagit.org/opendataschema/table-schema-to-markdown.git
cd table-schema-to-markdown
npm install
```

Use it:

```bash
node src/cli.js <schema.json>
LC_ALL=fr node src/cli.js <schema.json>
LC_ALL=fr node src/cli.js --template <template.hbs> <schema.json>
```

## Other implementations

- https://github.com/AntoineAugusti/table-schema-to-markdown
