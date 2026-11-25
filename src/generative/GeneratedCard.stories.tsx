import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { GeneratedCard } from './GeneratedCard'
import Button from '@/components/ui/Button'

const example = JSON.stringify({
  root: 'service',
  elements: {
    service: { type: 'Card', props: { title: 'Service status' }, children: ['status', 'message'] },
    status: { type: 'Status', props: { label: 'Operational', tone: 'success' } },
    message: { type: 'Text', props: { text: 'The service is accepting requests.' } },
  },
}, null, 2)

function Workshop({ source }: { source: string }) {
  const [draft, setDraft] = useState(source)
  const [rendered, setRendered] = useState(source)
  return (
    <div className="mx-auto grid max-w-2xl gap-4 p-4">
      <form className="grid gap-2" onSubmit={(event) => {
        event.preventDefault()
        setRendered(draft)
      }}>
        <label htmlFor="ui-spec">UI specification</label>
        <textarea id="ui-spec" className="rounded border border-slate-300 p-2 font-mono text-sm"
          rows={12} maxLength={12_000} value={draft} onChange={(event) => setDraft(event.target.value)} />
        <div><Button type="submit">Render preview</Button></div>
      </form>
      <GeneratedCard source={rendered} />
    </div>
  )
}

const meta = { title: 'Generative UI/Card', component: GeneratedCard } satisfies Meta<typeof GeneratedCard>
export default meta
type Story = StoryObj<typeof meta>

export const Preview: Story = {
  args: { source: example },
  render: (args) => <Workshop {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Service status' })).toBeVisible()
    await expect(canvas.getByText('Operational')).toBeVisible()
  },
}

export const RejectsUnsupportedSpec: Story = {
  args: { source: example },
  render: (args) => <Workshop {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(canvas.getByRole('textbox', { name: 'UI specification' }))
    await userEvent.paste('{"root":"x","elements":{"x":{"type":"Link","props":{"url":"/admin"}}}}')
    await userEvent.click(canvas.getByRole('button', { name: 'Render preview' }))
    await expect(canvas.getByRole('alert')).toHaveTextContent('Use only the Card, Text, and Status fields')
    await expect(canvas.queryByRole('heading', { name: 'Service status' })).not.toBeInTheDocument()
  },
}
