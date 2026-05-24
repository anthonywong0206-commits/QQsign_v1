import { useState } from 'react'
import { Settings, ClipboardCheck, FileText, Home } from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="bg-slate-900 text-white p-5 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold">
            Q
          </div>

          <div>
            <h1 className="text-2xl font-bold">QuickSign</h1>
            <p className="text-sm text-slate-300">
              快速完成簽收、即場登記及電子簽名。
            </p>
          </div>
        </div>
      </header>

      <main className="p-4">
        {page === 'home' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-4">建立簽收項目</h2>

              <div className="space-y-3">
                <input
                  className="w-full border rounded-2xl p-4"
                  placeholder="活動名稱"
                />

                <input
                  className="w-full border rounded-2xl p-4"
                  placeholder="活動地點"
                />

                <input
                  type="date"
                  className="w-full border rounded-2xl p-4"
                />

                <button className="w-full bg-slate-900 text-white rounded-2xl p-4 font-semibold">
                  啟動簽到模式
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-3">功能預覽</h3>

              <ul className="space-y-2 text-slate-700">
                <li>✅ 電子簽名</li>
                <li>✅ Walk-in 登記</li>
                <li>✅ PNG 匯出</li>
                <li>✅ PDF 匯出</li>
                <li>✅ Mobile-first</li>
              </ul>
            </div>
          </div>
        )}

        {page === 'checkin' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">簽到模式</h2>

            <input
              className="w-full border rounded-2xl p-4 text-lg"
              placeholder="請輸入姓名"
            />

            <input
              className="w-full border rounded-2xl p-4 text-lg"
              placeholder="電話"
            />

            <div className="border-2 border-dashed rounded-2xl h-48 flex items-center justify-center text-slate-400">
              電子簽名區域
            </div>

            <button className="w-full bg-green-600 text-white rounded-2xl p-5 text-lg font-bold">
              確認簽收
            </button>
          </div>
        )}

        {page === 'records' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-4">簽收紀錄</h2>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">姓名</th>
                    <th className="text-left py-2">時間</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="py-3">陳大文</td>
                    <td className="py-3">10:30 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {page === 'settings' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">設定</h2>

            <input
              className="w-full border rounded-2xl p-4"
              placeholder="機構名稱"
            />

            <input
              className="w-full border rounded-2xl p-4"
              placeholder="管理密碼"
              type="password"
            />

            <button className="w-full bg-slate-900 text-white rounded-2xl p-4">
              儲存設定
            </button>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="grid grid-cols-4">
          <button
            onClick={() => setPage('home')}
            className="flex flex-col items-center gap-1 py-3"
          >
            <Home size={20} />
            <span className="text-xs">首頁</span>
          </button>

          <button
            onClick={() => setPage('checkin')}
            className="flex flex-col items-center gap-1 py-3"
          >
            <ClipboardCheck size={20} />
            <span className="text-xs">簽到</span>
          </button>

          <button
            onClick={() => setPage('records')}
            className="flex flex-col items-center gap-1 py-3"
          >
            <FileText size={20} />
            <span className="text-xs">紀錄</span>
          </button>

          <button
            onClick={() => setPage('settings')}
            className="flex flex-col items-center gap-1 py-3"
          >
            <Settings size={20} />
            <span className="text-xs">設定</span>
          </button>
        </div>
      </nav>
    </div>
  )
}