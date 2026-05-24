import { useState, useEffect } from 'react'

import SignaturePad from './components/SignaturePad'
import FieldBuilder from './components/FieldBuilder'
import LogoUploader from './components/LogoUploader'
import SearchBar from './components/SearchBar'
import QRCodeCard from './components/QRCodeCard'
import ActivityManager from './components/ActivityManager'
import StatsCard from './components/StatsCard'
import KioskMode from './components/KioskMode'
import ImportParticipants from './components/ImportParticipants'

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
  exportCSV
} from './lib/csvExport'

import {
  exportBackup
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
  Download,
  Trash2,
  BarChart3
} from 'lucide-react'

export default function App() {
  const [page, setPage] =
    useState('home')

  const [records, setRecords] =
    useState([])

  const [settings, setSettings] =
    useState(getSettings())

  const [activities, setActivities] =
    useState(
      JSON.parse(
        localStorage.getItem(
          'quicksign-activities'
        ) || '[]'
      )
    )

  const [currentActivity, setCurrentActivity] =
    useState(null)

  const [fields, setFields] =
    useState([])

  const [name, setName] =
    useState('')

  const [signature, setSignature] =
    useState('')

  const [fieldValues, setFieldValues] =
    useState({})

  const [keyword, setKeyword] =
    useState('')

  const [logo, setLogo] = useState(
    localStorage.getItem('quicksign-logo') ||
      ''
  )

  const [participants, setParticipants] =
    useState([])

  const [kioskEnabled, setKioskEnabled] =
    useState(false)

  useEffect(() => {
    setRecords(getRecords())

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(
        '/sw.js'
      )
    }
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
      activity:
        currentActivity?.name ||
        '未分類活動',
      name,
      fieldValues,
      signature,
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
        .includes(keyword.toLowerCase())
  )

  return (
    <div
      className={`min-h-screen pb-24 ${
        kioskEnabled
          ? 'bg-black'
          : 'bg-slate-100'
      }`}
    >
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
          <>
            <StatsCard
              records={records}
            />

            <ActivityManager
              activities={activities}
              setActivities={setActivities}
              currentActivity={
                currentActivity
              }
              setCurrentActivity={
                setCurrentActivity
              }
            />

            <KioskMode
              enabled={kioskEnabled}
              setEnabled={
                setKioskEnabled
              }
            />

            <ImportParticipants
              onImport={
                setParticipants
              }
            />

            <div className="bg-white rounded-3xl p-5 shadow-sm">
              <h2 className="text-xl font-bold mb-4">
                自訂欄位
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
                開始簽到
              </button>
            </div>

            <QRCodeCard />
          </>
        )}

        {page === 'checkin' && (
          <div
            className={`rounded-3xl p-5 shadow-sm space-y-4 ${
              kioskEnabled
                ? 'bg-slate-900 text-white'
                : 'bg-white'
            }`}
          >
            <h2 className="text-3xl font-bold">
              {currentActivity?.name ||
                '即場登記'}
            </h2>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border rounded-2xl p-6 text-2xl text-black"
              placeholder="姓名"
            />

            {fields.map((field, index) => (
              <input
                key={index}
                type={field.type}
                placeholder={field.label}
                className="w-full border rounded-2xl p-6 text-2xl text-black"
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
              className="w-full bg-green-600 text-white rounded-2xl p-6 text-2xl font-bold"
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
                      <div className="font-bold text-lg">
                        #{record.number}{' '}
                        {record.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {record.activity}
                      </div>

                      <div className="text-sm text-slate-400">
                        {record.time}
                      </div>

                      {record.signature && (
                        <img
                          src={record.signature}
                          className="mt-4 border rounded-xl"
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
                className="bg-slate-900 text-white rounded-2xl p-4"
              >
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
                onClick={() =>
                  exportCSV(records)
                }
                className="bg-green-600 text-white rounded-2xl p-4"
              >
                CSV
              </button>

              <button
                onClick={() =>
                  exportBackup({
                    records,
                    settings,
                    activities
                  })
                }
                className="bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2"
              >
                <Download size={18} />
                備份
              </button>
            </div>

            <button
              onClick={() => {
                clearRecords()
                setRecords([])
              }}
              className="w-full border border-red-500 text-red-500 rounded-2xl p-4 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              清除全部紀錄
            </button>
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
            </div>
          </div>
        )}
      </main>

      {!kioskEnabled && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="grid grid-cols-4">
            <button
              onClick={() =>
                setPage('home')
              }
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
    </div>
  )
}