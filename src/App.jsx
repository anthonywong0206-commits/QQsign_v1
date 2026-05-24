import { useState, useEffect } from 'react'
import SignaturePad from './components/SignaturePad'
import PasswordModal from './components/PasswordModal'
import FieldBuilder from './components/FieldBuilder'

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
  getSettings,
  saveSettings
} from './lib/settings'

import {
  Settings,
  ClipboardCheck,
  FileText,
  Home,
  Lock,
  Moon,
  Sun
} from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')

  const [records, setRecords] = useState([])

  const [name, setName] = useState('')

  const [signature, setSignature] =
    useState('')

  const [fields, setFields] = useState([])

  const [fieldValues, setFieldValues] =
    useState({})

  const [settings, setSettings] =
    useState(getSettings())

  const [kioskMode, setKioskMode] =
    useState(false)

  const [showPasswordModal, setShowPasswordModal] =
    useState(false)

  useEffect(() => {
    setRecords(getRecords())
  }, [])

  useEffect(() => {
    document.body.className = settings.darkMode
      ? 'dark bg-slate-900'
      : 'bg-slate-100'
  }, [settings.darkMode])

  const submitCheckIn = () => {
    const record = {
      id: Date.now(),
      name,
      signature,
      fieldValues,
      time: new Date().toLocaleString()
    }

    saveRecord(record)

    setRecords(getRecords())

    setName('')
    setSignature('')
    setFieldValues({})

    setPage('records')
  }

  const toggleKioskMode = () => {
    if (!kioskMode) {
      setKioskMode(true)
      setPage('checkin')
    } else {
      setShowPasswordModal(true)
    }
  }

  return (
    <div
      className={`min-h-screen pb-24 ${
        settings.darkMode
          ? 'bg-slate-900 text-white'
          : 'bg-slate-100'
      }`}
    >
      <header
        className={`p-5 sticky top-0 z-50 shadow-lg ${
          settings.darkMode
            ? 'bg-black'
            : 'bg-slate-900 text-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {settings.organization}
            </h1>

            <p className="text-sm opacity-80">
              QuickSign
            </p>
          </div>

          <button
            onClick={() => {
              const updated = {
                ...settings,
                darkMode: !settings.darkMode
              }

              setSettings(updated)
              saveSettings(updated)
            }}
            className="bg-white/10 rounded-xl p-3"
          >
            {settings.darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {page === 'home' && (
          <div className="space-y-4">
            <div
              className={`rounded-3xl p-5 shadow-sm ${
                settings.darkMode
                  ? 'bg-slate-800'
                  : 'bg-white'
              }`}
            >
              <h2 className="text-xl font-bold mb-4">
                建立簽收項目
              </h2>

              <FieldBuilder
                fields={fields}
                setFields={setFields}
              />

              <button
                onClick={toggleKioskMode}
                className="w-full bg-slate-900 text-white rounded-2xl p-4 font-bold mt-5 flex items-center justify-center gap-2"
              >
                <Lock size={20} />
                {kioskMode
                  ? '退出簽到模式'
                  : '啟動簽到模式'}
              </button>
            </div>
          </div>
        )}

        {page === 'checkin' && (
          <div
            className={`rounded-3xl p-5 shadow-sm space-y-4 ${
              settings.darkMode
                ? 'bg-slate-800'
                : 'bg-white'
            }`}
          >
            <h2 className="text-2xl font-bold">
              即場登記
            </h2>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-2xl p-5 text-lg text-black"
              placeholder="姓名"
            />

            {fields.map((field, index) => (
              <input
                key={index}
                type={field.type}
                placeholder={field.label}
                className="w-full border rounded-2xl p-5 text-black"
                value={
                  fieldValues[field.label] || ''
                }
                onChange={(e) =>
                  setFieldValues({
                    ...fieldValues,
                    [field.label]:
                      e.target.value
                  })
                }
              />
            ))}

            <SignaturePad
              onSave={(data) =>
                setSignature(data)
              }
            />

            <button
              onClick={submitCheckIn}
              className="w-full bg-green-600 text-white rounded-2xl p-5 text-xl font-bold"
            >
              確認簽收
            </button>
          </div>
        )}

        {page === 'records' && (
          <div className="space-y-4">
            <div
              id="record-table"
              className={`rounded-3xl p-5 shadow-sm ${
                settings.darkMode
                  ? 'bg-slate-800'
                  : 'bg-white'
              }`}
            >
              <h2 className="text-xl font-bold mb-4">
                簽收紀錄
              </h2>

              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-2xl p-4"
                  >
                    <div className="font-bold text-lg">
                      {record.name}
                    </div>

                    <div className="text-sm opacity-70">
                      {record.time}
                    </div>

                    {Object.entries(
                      record.fieldValues || {}
                    ).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-sm mt-1"
                      >
                        {key}: {value}
                      </div>
                    ))}

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
                className="bg-slate-900 text-white rounded-2xl p-4"
              >
                匯出 PNG
              </button>

              <button
                onClick={() =>
                  exportPDF('record-table')
                }
                className="bg-red-600 text-white rounded-2xl p-4"
              >
                匯出 PDF
              </button>
            </div>

            <button
              onClick={() => {
                clearRecords()
                setRecords([])
              }}
              className="w-full border border-red-500 text-red-500 rounded-2xl p-4"
            >
              清空全部紀錄
            </button>
          </div>
        )}

        {page === 'settings' && (
          <div
            className={`rounded-3xl p-5 shadow-sm space-y-4 ${
              settings.darkMode
                ? 'bg-slate-800'
                : 'bg-white'
            }`}
          >
            <h2 className="text-xl font-bold">
              系統設定
            </h2>

            <input
              value={settings.organization}
              onChange={(e) => {
                const updated = {
                  ...settings,
                  organization:
                    e.target.value
                }

                setSettings(updated)
                saveSettings(updated)
              }}
              className="w-full border rounded-2xl p-4 text-black"
              placeholder="機構名稱"
            />

            <input
              value={settings.password}
              onChange={(e) => {
                const updated = {
                  ...settings,
                  password:
                    e.target.value
                }

                setSettings(updated)
                saveSettings(updated)
              }}
              className="w-full border rounded-2xl p-4 text-black"
              placeholder="管理密碼"
            />
          </div>
        )}
      </main>

      {!kioskMode && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="grid grid-cols-4">
            <button
              onClick={() => setPage('home')}
              className="flex flex-col items-center gap-1 py-3"
            >
              <Home size={20} />
              <span className="text-xs">
                首頁
              </span>
            </button>

            <button
              onClick={() =>
                setPage('checkin')
              }
              className="flex flex-col items-center gap-1 py-3"
            >
              <ClipboardCheck size={20} />
              <span className="text-xs">
                簽到
              </span>
            </button>

            <button
              onClick={() =>
                setPage('records')
              }
              className="flex flex-col items-center gap-1 py-3"
            >
              <FileText size={20} />
              <span className="text-xs">
                紀錄
              </span>
            </button>

            <button
              onClick={() =>
                setPage('settings')
              }
              className="flex flex-col items-center gap-1 py-3"
            >
              <Settings size={20} />
              <span className="text-xs">
                設定
              </span>
            </button>
          </div>
        </nav>
      )}

      {showPasswordModal && (
        <PasswordModal
          correctPassword={settings.password}
          onClose={() =>
            setShowPasswordModal(false)
          }
          onSuccess={() => {
            setKioskMode(false)
            setShowPasswordModal(false)
          }}
        />
      )}
    </div>
  )
}