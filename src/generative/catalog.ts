import { defineCatalog } from '@json-render/core'
import type { Spec } from '@json-render/core'
import { schema } from '@json-render/react/schema'
import { z } from 'zod'

const id = z.string().regex(/^[a-z][a-z0-9-]{0,31}$/)
const maxChildren = 12
const components = {
  Card: {
    props: z.strictObject({ title: z.string().min(1).max(100) }),
    slots: ['default'],
    description: 'The root card. Its children may only be Text or Status. Use at most 12 children.',
  },
  Text: {
    props: z.strictObject({ text: z.string().min(1).max(400) }),
    description: 'A short paragraph of plain text.',
  },
  Status: {
    props: z.strictObject({
      label: z.string().min(1).max(80),
      tone: z.enum(['neutral', 'success', 'warning']),
    }),
    description: 'A short status label with a tone.',
  },
}
export const catalog = defineCatalog(schema, { components, actions: {} })

const element = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('Card'), props: components.Card.props, children: z.array(id).min(1).max(maxChildren) }),
  z.strictObject({ type: z.literal('Text'), props: components.Text.props, children: z.tuple([]).optional() }),
  z.strictObject({ type: z.literal('Status'), props: components.Status.props, children: z.tuple([]).optional() }),
])
const uiSpec = z.strictObject({ root: id, elements: z.record(id, element) })

// Restrict the example to one card with text/status leaves, including when a
// spec comes from outside the project. This also rules out cyclic references.
export function parseUISpec(source: string): Spec {
  if (source.length > 12_000) throw new Error('The specification is too large.')
  let input: unknown
  try {
    input = JSON.parse(source)
  } catch {
    throw new Error('Enter valid JSON.')
  }
  const parsed = uiSpec.safeParse(input)
  if (!parsed.success) throw new Error('Use only the Card, Text, and Status fields in the catalog.')
  const spec = parsed.data
  const root = spec.elements[spec.root]
  if (root?.type !== 'Card') throw new Error('The root must identify a card.')
  const children = new Set(root.children)
  if (children.size !== root.children.length || Object.keys(spec.elements).length !== children.size + 1
    || root.children.some((key) => !Object.prototype.hasOwnProperty.call(spec.elements, key) || spec.elements[key].type === 'Card')) {
    throw new Error('Give each child a unique reference to an existing Text or Status element.')
  }
  return spec
}

export function generationPrompt(): string {
  return [
    'Return a single JSON object matching the schema below. Use no Markdown or JSON patches.',
    'Use one Card at the root and only Text or Status leaves. Give every element a unique ID and include it exactly once.',
    'Use literal props. The preview accepts no action bindings, state, or external URLs.',
    JSON.stringify(z.toJSONSchema(uiSpec), null, 2),
  ].join('\n')
}
