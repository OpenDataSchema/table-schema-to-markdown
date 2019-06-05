# Table Schema to Markdown

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

The program reads your current locale to output translated messages, but it's possible to pass another locale:

```bash
LC_ALL=fr table-schema-to-markdown schema.json
```

Another Handlebars template file or partials directory can be passed also:

```bash
table-schema-to-markdown --template my_template.hbs --partials my_partials_dir schema.json
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
