import { defineRegistry, JSONUIProvider, Renderer } from '@json-render/react'
import { catalog, parseUISpec } from './catalog'


const tones = {
  neutral: 'bg-slate-100 text-slate-900',
  success: 'bg-emerald-100 text-emerald-900',
  warning: 'bg-amber-100 text-amber-900',
}

const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{props.title}</h2>
        <div className="mt-2 space-y-2">{children}</div>
      </section>
    ),
    Text: ({ props }) => <p className="text-sm text-slate-700">{props.text}</p>,
    Status: ({ props }) => (
      <p className={`inline-block rounded-full px-2.5 py-1 text-sm font-medium ${tones[props.tone]}`}>{props.label}</p>
    ),
  },
})

export function GeneratedCard({ source }: { source: string }) {
  let spec
  try {
    spec = parseUISpec(source)
  } catch (error) {
    return <p role="alert">{error instanceof Error ? error.message : 'Unable to read the specification.'}</p>
  }

  return (
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  )
}
