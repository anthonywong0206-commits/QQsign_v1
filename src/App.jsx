import { useState, useEffect } from 'react'
import SignaturePad from './components/SignaturePad'
import {
  saveRecord,
  getRecords,
  clearRecords
} from './lib/storage'

import {
  exportPNG,
  exportPDF
} from './lib/export'

import {
  Settings,
  ClipboardCheck,
  FileText,
  Home,
  Trash2,
  Download
} from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [signature, setSignature] = useState('')

  const [records, setRecords] = useState([])

  useEffect(() => {
    setRecords(getRecords())
  }, [])

  const submitCheckIn = () => {
    if (!name) return

    const record = {
      id: Date.now(),
      name,
      phone,
      signature,
      time: new Date().toLocaleString()
    }

    saveRecord(record)

    setRecords(getRecords())

    setPage('success')

    setName('')
    setPhone('')
    setSignature('')
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="bg-slate-900 text-white p-5 shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold">QuickSign</h1>
        <p className="text-sm text-slate-300">
          快速完成簽收、即場登記及電子簽名。
        </p>
      </header>

      <main className="p-4">
        {page === 'home' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">
              建立簽收項目
            </h2>

            <input
              className="w-full border rounded-2xl p-4"
              placeholder="活動名稱"
            />

            <button
              onClick={() => setPage('checkin')}
              className="w-full bg-slate-900 text-white rounded-2xl p-4 font-bold"
            >
              啟動簽到模式
            </button>
          </div>
        )}

        {page === 'checkin' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-xl font-bold">
              即場登記
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-2xl p-4 text-lg"
              placeholder="姓名"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-2xl p-4 text-lg"
              placeholder="電話"
            />

            <SignaturePad
              onSave={(data) => setSignature(data)}
            />

            <button
              onClick={submitCheckIn}
              className="w-full bg-green-600 text-white rounded-2xl p-5 text-lg font-bold"
            >
              確認簽收
            </button>
          </div>
        )}

        {page === 'success' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm text-center space-y-4">
            <div className="text-6xl">✅</div>

            <h2 className="text-2xl font-bold">
              已成功簽收
            </h2>

            <button
              onClick={() => setPage('checkin')}
              className="w-full bg-slate-900 text-white rounded-2xl p-4"
            >
              下一位
            </button>
          </div>
        )}

        {page === 'records' && (
          <div className="space-y-4">
            <div
              id="record-table"
              className="bg-white rounded-3xl p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4">
                簽收紀錄
              </h2>

              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-2xl p-4"
                  >
                    <div className="font-bold text-lg">
                      {record.name}
                    </div>

                    <div className="text-sm text-slate-500">
                      {record.phone}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      {record.time}
                    </div>

                    {record.signature && (
                      <img
                        src={record.signature}
                        className="mt-3 border rounded-xl bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  exportPNG('record-table')
                }
                className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                PNG
              </button>

              <button
                onClick={() =>
                  exportPDF('record-table')
                }
                className="bg-red-600 text-white rounded-2xl p-4"
              >
                PDF
              </button>
            </div>

            <button
              onClick={() => {
                clearRecords()
                setRecords([])
              }}
              className="w-full bg-white border border-red-500 text-red-500 rounded-2xl p-4 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              清空全部紀錄
            </button>
          </div>
        )}

        {page === 'settings' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <h2 className="text-xl font-bold">
              設定
            </h2>

            <p className="mt-4 text-slate-500">
              第二批已加入：
            </p>

            <ul className="mt-3 space-y-2 text-sm">
              <li>✅ 電子簽名</li>
              <li>✅ localStorage</li>
              <li>✅ PNG 匯出</li>
              <li>✅ PDF 匯出</li>
            </ul>
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