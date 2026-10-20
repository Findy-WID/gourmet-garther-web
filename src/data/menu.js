// ─────────────────────────────────────────────────────────────
// MENU LOADER
//
// Dishes, prices and photos are edited in the admin panel (/admin).
// The admin saves them as files in /content:
//   content/dishes/<dish>.json   one file per dish
//   content/option-groups.json   shared choices (protein, size…) and extras
// This file reads those and shapes them for the site. You shouldn't need to edit it.
// ─────────────────────────────────────────────────────────────
import optionGroups from '../../content/option-groups.json'
import { slugify } from '../lib/format'

const dishFiles = import.meta.glob('../../content/dishes/*.json', { eager: true, import: 'default' })

export const SECTIONS = [
  {
    id: 'plates',
    name: 'Plates',
    short: 'Single meals, ready to eat',
    long: 'One person, one plate. Pick your protein, add your sides, and it’s packed hot.',
  },
  {
    id: 'buckets',
    name: 'Buckets',
    short: 'Big portions for the family or the week',
    long: 'Stews, soups and rice in sealed buckets. Feed the house, or stock your freezer for the week.',
  },
  {
    id: 'corporate',
    name: 'Workplace',
    short: 'Office lunches, meetings and events',
    long: 'Packed lunches for the team, trays for meetings and feasts for office parties. One-off or on a weekly or monthly schedule.',
  },
]

const choiceById = new Map(
  (optionGroups.choices || []).map((g) => [
    g.id,
    {
      id: g.id,
      label: g.label,
      options: (g.options || []).map((o, i) => ({
        id: slugify(o.label) || `opt-${i}`,
        label: o.label,
        price: Number(o.price) || 0,
      })),
    },
  ]),
)

const extrasById = new Map(
  (optionGroups.extras || []).map((g) => [
    g.id,
    {
      max: Number(g.max) || null,
      items: (g.items || []).map((e, i) => ({
        id: slugify(e.label) || `extra-${i}`,
        label: e.label,
        note: e.note || '',
        price: Number(e.price) || 0,
      })),
    },
  ]),
)

export const MENU = Object.entries(dishFiles)
  .map(([path, d]) => {
    const extras = d.extrasGroup ? extrasById.get(d.extrasGroup) : null
    return {
      id: path.split('/').pop().replace(/\.json$/, ''),
      name: d.name,
      section: d.section,
      group: d.category || 'Other',
      price: Number(d.price) || 0,
      unit: d.unit || '',
      description: d.description || '',
      image: d.image || '',
      popular: !!d.popular,
      available: d.available !== false,
      minQty: Math.max(Number(d.minQty) || 1, 1),
      sort: Number(d.sort) || 999,
      choices: (d.choiceGroups || [])
        .map((id) => choiceById.get(id))
        .filter((c) => c && c.options.length),
      extras: extras?.items || [],
      extrasMax: extras?.max || undefined,
    }
  })
  .filter((d) => d.name && SECTIONS.some((s) => s.id === d.section))
  .sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))

export const getItem = (id) => MENU.find((m) => m.id === id)
export const itemsIn = (section) => MENU.filter((m) => m.section === section)
export const groupsIn = (section) => [...new Set(itemsIn(section).map((m) => m.group))]
