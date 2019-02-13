const fs = require("fs")
const path = require("path")
const argv = require("minimist")(process.argv.slice(2))
const areIntlLocalesSupported = require("intl-locales-supported")
const handlebars = require("handlebars")
const osLocale = require("os-locale")
const { get } = require("lodash")
const { Schema } = require("tableschema")

const translations = require("./translations.json")

function isDir(dirPath) {
  return fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()
}

// Load handlebars-helpers.
require("handlebars-helpers")({ handlebars })

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
setupIntlPolyfill([locale])

// Load handlebars-intl after applying Intl polyfill.
const HandlebarsIntl = require("handlebars-intl")
HandlebarsIntl.registerWith(handlebars)

function transformField(field) {
  const format = get(translations.format, `${locale}.${field.format}`, field.format)
  const type = get(translations.type, `${locale}.${field.type}`, field.type)
  return { ...field, format, type }
}

function transformSchema(schema, locale) {
  const fields = schema.fields.map(transformField)
  return { ...schema, fields }
}

async function main() {
  // Process file arguments.

  const schemaFilePath = path.resolve(argv._[0])
  const defaultTemplateFilePath = path.resolve(__dirname, "templates", "fr", "index.hbs")
  const templateFilePath = argv.template ? path.resolve(argv.template) : defaultTemplateFilePath

  let schema = await Schema.load(schemaFilePath, { strict: true })

  let schemaJson = require(schemaFilePath)

  schema = { ...schemaJson, ...schema.descriptor }
  schema = transformSchema(schema, locale)

  const templateSource = fs.readFileSync(templateFilePath, "utf8")

  function registerPartials(partialsDir) {
    fs.readdirSync(partialsDir).forEach(partialFileName => {
      const partialFilePath = path.resolve(partialsDir, partialFileName)
      const partialSource = fs.readFileSync(partialFilePath, "utf-8")
      const partialName = path.basename(partialFilePath, path.extname(partialFilePath))
      handlebars.registerPartial(partialName, partialSource)
    })
  }
  const defaultPartialsDir = path.resolve(defaultTemplateFilePath, "..", "partials")
  if (isDir(defaultPartialsDir)) {
    registerPartials(defaultPartialsDir)
  }
  if (argv.template) {
    const templatePartialsDir = path.resolve(templateFilePath, "..", "partials")
    if (isDir(templatePartialsDir)) {
      registerPartials(templatePartialsDir)
    }
  }
  if (argv.partials) {
    registerPartials(argv.partials)
  }

  const template = handlebars.compile(templateSource)

  const intlData = { locales: locale }
  const output = template(schema, { data: { intl: intlData } })

  console.log(output)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
