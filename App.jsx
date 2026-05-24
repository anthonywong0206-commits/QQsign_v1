import { useState, useEffect } from 'react'

import SignaturePad from './components/SignaturePad'
import PasswordModal from './components/PasswordModal'
import FieldBuilder from './components/FieldBuilder'
import LogoUploader from './components/LogoUploader'
import SearchBar from './components/SearchBar'

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
  exportBackup,
  importBackup
} from './lib/backup'

import {
  getSettings,
  saveSettings
} from './lib/settings'

import {
  Home,
  ClipboardCheck,
  FileText,
  Settings,
  Share2,
  Trash2,
  Download,
  Upload
} from 'lucide-react'

export default function App() {
  const [page, setPage] = useState('home')

  const [records, setRecords] = useState([])

  const [keyword, setKeyword] =
    useState('')

  const [name, setName] = useState('')

  const [signature, setSignature] =
    useState('')

  const [fields, setFields] =
    useState([])

  const [fieldValues, setFieldValues] =
    useState({})

  const [settings, setSettings] =
    useState(getSettings())

  const [logo, setLogo] = useState(
    localStorage.getItem('quicksign-logo') ||
      ''
  )

  const [showPasswordModal, setShowPasswordModal] =
    useState(false)

  useEffect(() => {
    setRecords(getRecords())
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'quicksign-logo',
      logo
    )
  }, [logo])

  const submitCheckIn = () => {
    const record = {
      id: Date.now(),
      number: records.length + 1,
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

  const filteredRecords = records.filter(
    (record) =>
      record.name
        ?.toLowerCase()
        .includes(keyword.toLowerCase()) ||
      JSON.stringify(record.fieldValues)
        .toLowerCase()
        .includes(keyword.toLowerCase())
  )

  const shareRecords = async () => {
    const element =
      document.getElementById(
        'record-table'
      )

    const canvas =
      await html2canvas(element)

    canvas.toBlob(async (blob) => {
      const file = new File(
        [blob],
        'quicksign.png',
        {
          type: 'image/png'
        }
      )

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'QuickSign'
        })
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      <header className="bg-slate-900 text-white p-5 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {logo ? (
            <img
              src={logo}
              className="w-14 h-14 rounded-2xl object-cover bg-white"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/10" />
          )}

          <div>
            <h1 className="text-2xl font-bold">
              {settings.organization}
            </h1>

            <p className="text-sm text-slate-300">
              QuickSign
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {page === 'home' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-5">
                建立簽收項目
              </h2>

              <FieldBuilder
                fields={fields}
                setFields={setFields}
              />

              <button
                onClick={() =>
                  setPage('checkin')
                }
                className="w-full bg-slate-900 text-white rounded-2xl p-5 font-bold mt-5"
              >
                啟動簽到模式
              </button>
            </div>
          </div>
        )}

        {page === 'checkin' && (
          <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
            <h2 className="text-2xl font-bold">
              即場登記
            </h2>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-2xl p-5 text-lg"
              placeholder="姓名"
            />

            {fields.map((field, index) => (
              <input
                key={index}
                type={field.type}
                placeholder={field.label}
                className="w-full border rounded-2xl p-5 text-lg"
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
            <SearchBar
              keyword={keyword}
              setKeyword={setKeyword}
            />

            <div
              id="record-table"
              className="bg-white rounded-3xl p-5 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4">
                簽收紀錄
              </h2>

              <div className="space-y-4">
                {filteredRecords.map(
                  (record) => (
                    <div
                      key={record.id}
                      className="border rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">
                            #{record.number}{' '}
                            {record.name}
                          </div>

                          <div className="text-sm text-slate-500">
                            {record.time}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated =
                              records.filter(
                                (r) =>
                                  r.id !==
                                  record.id
                              )

                            localStorage.setItem(
                              'quicksign-records',
                              JSON.stringify(
                                updated
                              )
                            )

                            setRecords(updated)
                          }}
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {Object.entries(
                        record.fieldValues || {}
                      ).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="text-sm mt-2"
                          >
                            {key}: {value}
                          </div>
                        )
                      )}

                      {record.signature && (
                        <img
                          src={record.signature}
                          className="mt-4 border rounded-xl bg-white"
                        />
                      )}
                    </div>
                  )
                )}
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

              <button
                onClick={shareRecords}
                className="bg-green-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                分享
              </button>

              <button
                onClick={() =>
                  exportBackup({
                    records,
                    settings,
                    fields
                  })
                }
                className="bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                備份
              </button>
            </div>
          </div>
        )}

        {page === 'settings' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
              <h2 className="text-xl font-bold">
                系統設定
              </h2>

              <LogoUploader
                logo={logo}
                setLogo={setLogo}
              />

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
                className="w-full border rounded-2xl p-4"
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
                className="w-full border rounded-2xl p-4"
                placeholder="管理密碼"
              />

              <label className="block">
                <span className="font-semibold">
                  匯入備份
                </span>

                <input
                  type="file"
                  accept=".json"
                  className="w-full border rounded-2xl p-3 mt-2"
                  onChange={(e) => {
                    const file =
                      e.target.files[0]

                    if (!file) return

                    importBackup(
                      file,
                      (data) => {
                        localStorage.setItem(
                          'quicksign-records',
                          JSON.stringify(
                            data.records || []
                          )
                        )

                        setRecords(
                          data.records || []
                        )

                        if (
                          data.settings
                        ) {
                          setSettings(
                            data.settings
                          )

                          saveSettings(
                            data.settings
                          )
                        }

                        if (
                          data.fields
                        ) {
                          setFields(
                            data.fields
                          )
                        }
                      }
                    )
                  }}
                />
              </label>

              <button
                onClick={() => {
                  clearRecords()
                  setRecords([])
                }}
                className="w-full border border-red-500 text-red-500 rounded-2xl p-4"
              >
                清除全部資料
              </button>
            </div>
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
            onClick={() =>
              setPage('checkin')
            }
            className="flex flex-col items-center gap-1 py-3"
          >
            <ClipboardCheck size={20} />
            <span className="text-xs">簽到</span>
          </button>

          <button
            onClick={() =>
              setPage('records')
            }
            className="flex flex-col items-center gap-1 py-3"
          >
            <FileText size={20} />
            <span className="text-xs">紀錄</span>
          </button>

          <button
            onClick={() =>
              setPage('settings')
            }
            className="flex flex-col items-center gap-1 py-3"
          >
            <Settings size={20} />
            <span className="text-xs">設定</span>
          </button>
        </div>
      </nav>

      {showPasswordModal && (
        <PasswordModal
          correctPassword={
            settings.password
          }
          onClose={() =>
            setShowPasswordModal(false)
          }
          onSuccess={() =>
            setShowPasswordModal(false)
          }
        />
      )}
    </div>
  )
}