import SignatureCanvas from 'react-signature-canvas'
import { useRef } from 'react'

export default function SignaturePad({ onSave }) {
  const sigRef = useRef()

  const clear = () => {
    sigRef.current.clear()
  }

  const save = () => {
    if (sigRef.current.isEmpty()) return

    const data = sigRef.current
      .getTrimmedCanvas()
      .toDataURL('image/png')

    onSave(data)
  }

  return (
    <div className="space-y-3">
      <div className="border-2 rounded-2xl overflow-hidden bg-white">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: 320,
            height: 180,
            className: 'w-full h-44'
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={clear}
          className="bg-slate-200 rounded-2xl p-3 font-semibold"
        >
          清除簽名
        </button>

        <button
          onClick={save}
          className="bg-slate-900 text-white rounded-2xl p-3 font-semibold"
        >
          儲存簽名
        </button>
      </div>
    </div>
  )
}