export default function KioskMode({
  enabled,
  setEnabled
}) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Kiosk 全螢幕模式
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            適合 iPad／活動現場使用
          </p>
        </div>

        <button
          onClick={() =>
            setEnabled(!enabled)
          }
          className={`px-5 py-3 rounded-2xl text-white font-bold ${
            enabled
              ? 'bg-green-600'
              : 'bg-slate-900'
          }`}
        >
          {enabled ? '已啟用' : '啟用'}
        </button>
      </div>
    </div>
  )
}