const fs = require("fs")
const path = require("path")
const argv = require("minimist")(process.argv.slice(2))
const areIntlLocalesSupported = require("intl-locales-supported")
const handlebars = require("handlebars")
const osLocale = require("os-locale")
const { Schema } = require("tableschema")

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
  // Process file arguments.

  const schemaFilePath = path.resolve(argv._[0])
  const defaultTemplateFilePath = path.resolve(__dirname, "templates", "fr", "index.hbs")
  const templateFilePath = argv.template ? path.resolve(argv.template) : defaultTemplateFilePath

  const schema = await Schema.load(schemaFilePath, { strict: true })

  // PARTIALS

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

  const i18n = require(`./i18n/${locale}.json`)
  const intlData = { locales, ...i18n }

  const output = template(schema.descriptor, { data: { intl: intlData } })

  console.log(output)
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
