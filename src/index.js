import handlebars from "handlebars"
import tableSchema from "tableschema"

// HELPERS

import handlebarsHelpers from "handlebars-helpers"
import HandlebarsIntl from "handlebars-intl"
import * as helpers from "./helpers.js"

HandlebarsIntl.registerWith(handlebars)
handlebarsHelpers({ handlebars })
handlebars.registerHelper(helpers)

// PARTIALS

import propertiesPartial from "./templates/partials/default/properties.hbs"
import propertyPartial from "./templates/partials/default/property.hbs"
import propertyListItemArrayIfValuePartial from "./templates/partials/default/propertyListItemArrayIfValue.hbs"
import propertyListItemIfValuePartial from "./templates/partials/default/propertyListItemIfValue.hbs"
import titleNamePathPartial from "./templates/partials/default/titleNamePath.hbs"
import schemaFieldPartial from "./templates/partials/fields-as-headings/schemaField.hbs"
import schemaFieldsPartial from "./templates/partials/fields-as-headings/schemaFields.hbs"

handlebars.registerPartial("properties", propertiesPartial)
handlebars.registerPartial("property", propertyPartial)
handlebars.registerPartial("propertyListItemArrayIfValue", propertyListItemArrayIfValuePartial)
handlebars.registerPartial("propertyListItemIfValue", propertyListItemIfValuePartial)
handlebars.registerPartial("schemaField", schemaFieldPartial)
handlebars.registerPartial("schemaFields", schemaFieldsPartial)
handlebars.registerPartial("titleNamePath", titleNamePathPartial)

// TEMPLATE

import indexTemplate from "./templates/index.hbs"

// LOCALES

import en from "./i18n/en.json"
import fr from "./i18n/fr.json"

const locales = { en, fr }

export async function toMarkdown({ descriptor, locale }) {
  const schema = await tableSchema.Schema.load(descriptor, { strict: true })
  const template = handlebars.compile(indexTemplate)
  const intlData = { locales: Object.keys(locales), ...locales[locale] }
  const markdown = template(schema.descriptor, { data: { intl: intlData } })
  return markdown
}
