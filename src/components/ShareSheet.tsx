import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Strings } from '../i18n'
import { downloadBlob, xIntentUrl } from '../share'
import { ResponsiveModal } from './ResponsiveModal'
import { XLogo } from './XLogo'

type ShareSheetProps = {
  open: boolean
  card: Blob | null
  text: string
  url: string
  strings: Strings
  onOpenChange: (open: boolean) => void
}

export function ShareSheet({ open, card, text, url, strings, onOpenChange }: ShareSheetProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!card) return
    const objectUrl = URL.createObjectURL(card)
    setPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [card])

  if (!card) return null

  return (
    <ResponsiveModal open={open} title={strings.shareTitle} closeLabel={strings.close} onOpenChange={onOpenChange}>
      {previewUrl && <img src={previewUrl} alt="" className="mt-4 w-full rounded-xl border border-white/10" />}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => downloadBlob(card, 'skocko.png')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-gold-hi to-gold py-3 font-display text-lg font-semibold tracking-wide text-[#3a2500] shadow-[0_4px_0_#b8860b,inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
        >
          <Download className="h-4.5 w-4.5" aria-hidden="true" />
          {strings.shareDownload}
        </button>
        <button
          type="button"
          onClick={() => window.open(xIntentUrl(text, url), '_blank', 'noopener')}
          className="flex items-center justify-center gap-2 rounded-2xl bg-linear-to-b from-[#22409f] to-[#152e80] py-3 font-display text-lg font-semibold tracking-wide text-ink-dim shadow-[0_4px_0_#0a1a5c] transition-transform duration-150 active:translate-y-[2px] active:shadow-none active:duration-0"
        >
          <XLogo className="h-4 w-4" />
          {strings.sharePost}
        </button>
      </div>
    </ResponsiveModal>
  )
}
