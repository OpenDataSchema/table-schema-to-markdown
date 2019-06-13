#! /usr/bin/env node

const fs = require("fs")
const path = require("path")
const areIntlLocalesSupported = require("intl-locales-supported")
const handlebars = require("handlebars")
const osLocale = require("os-locale")
const tableSchema = require("tableschema")

function isDir(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
}

// POLYFILLS

function setupIntlPolyfill(localesMyAppSupports) {
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(localesMyAppSupports)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and patch the constructors we need with the polyfill's.
      var IntlPolyfill = require("intl")
      Intl.NumberFormat = IntlPolyfill.NumberFormat
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require("intl")
  }
}

const locale = osLocale.sync().replace("_", "-")
const locales = [locale]
setupIntlPolyfill(locales)

async function main() {
  const doc = `
Usage:
  table-schema-to-markdown <schema_file_or_url> [--fields-format=<headings|table>] [--template=<file>] [--partials=<dir>]
  table-schema-to-markdown -h | --help | --version
`
  const { docopt } = require("docopt")
  const { version } = require("../package.json")
  const options = docopt(doc, { version })

  if (!options["--fields-format"]) {
    options["--fields-format"] = "headings"
  }

  const defaultTemplateFilePath = path.resolve(__dirname, "templates", "index.hbs")
  const templateFilePath = options["--template"] ? path.resolve(options["--template"]) : defaultTemplateFilePath

  let schema
  try {
    schema = await tableSchema.Schema.load(options["<schema_file_or_url>"], { strict: true })
  } catch (exception) {
    if (exception instanceof tableSchema.errors.TableSchemaError) {
      console.error("Could not load schema:", exception.message)
      return
    }
    throw exception
  }

  // PARTIALS

  function registerPartials(partialsDir) {
    fs.readdirSync(partialsDir).forEach(partialFileName => {
      const partialFilePath = path.resolve(partialsDir, partialFileName)
      const partialSource = fs.readFileSync(partialFilePath, "utf-8")
      const partialName = path.basename(partialFilePath, path.extname(partialFilePath))
      handlebars.registerPartial(partialName, partialSource)
    })
  }
  registerPartials(path.resolve(defaultTemplateFilePath, "..", "partials", "default"))
  if (options["--partials"]) {
    registerPartials(options["--partials"])
  }
  if (options["--fields-format"] === "headings") {
    registerPartials(path.resolve(defaultTemplateFilePath, "..", "partials", "fields-as-headings"))
  } else if (options["--fields-format"] === "table") {
    registerPartials(path.resolve(defaultTemplateFilePath, "..", "partials", "fields-as-table"))
  } else {
    console.error(`Invalid option value: "--fields-format=${options["--fields-format"]}"`)
    process.exit(1)
  }

  // HELPERS

  // Load handlebars-intl after applying Intl polyfill.
  const HandlebarsIntl = require("handlebars-intl")
  HandlebarsIntl.registerWith(handlebars)

  // Load handlebars-helpers.
  require("handlebars-helpers")({ handlebars })

  handlebars.registerHelper(require("./helpers.js"))

  // LOAD, COMPILE, RUN

  const templateSource = fs.readFileSync(templateFilePath, "utf8")
  const template = handlebars.compile(templateSource)

  const baseLocale = locale.split("-")[0]
  const localeJsonFilePath = path.resolve(__dirname, "i18n", `${baseLocale}.json`)
  if (!fs.existsSync(localeJsonFilePath)) {
    const supportedLocales = fs
      .readdirSync(path.resolve(__dirname, "i18n"))
      .map(fileName => path.basename(fileName, ".json"))
    console.error(
      `No translated messages exist for your locale "${locale}". Supported locales: ${supportedLocales.join(
        ", "
      )}. Pass LC_ALL environment variable to use another locale.`
    )
    return
  }
  const i18n = require(localeJsonFilePath)
  const intlData = { locales, ...i18n }

  const output = template(schema.descriptor, { data: { intl: intlData } })

  console.log(output)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
