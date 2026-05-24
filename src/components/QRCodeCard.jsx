import { QRCodeCanvas } from 'qrcode.react'

export default function QRCodeCard() {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm text-center space-y-4">
      <h2 className="text-xl font-bold">
        QR Code 簽到
      </h2>

      <div className="flex justify-center">
        <QRCodeCanvas
          value={window.location.href}
          size={220}
          bgColor="#ffffff"
          fgColor="#0f172a"
        />
      </div>

      <p className="text-sm text-slate-500">
        掃描 QR Code 即可進入簽到頁面
      </p>
    </div>
  )
}