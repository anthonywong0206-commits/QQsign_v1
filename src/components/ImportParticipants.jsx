export default function ImportParticipants({
  onImport
}) {
  const parseText = (text) => {
    const lines = text
      .split('\n')
      .filter(Boolean)

    const participants = lines.map(
      (line) => {
        const parts = line.split(' ')

        return {
          name: parts[0] || '',
          phone: parts[1] || '',
          member: parts[2] || ''
        }
      }
    )

    onImport(participants)
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <h2 className="text-xl font-bold">
        批量匯入參加者
      </h2>

      <textarea
        className="w-full border rounded-2xl p-4 h-40"
        placeholder="陳大文 91234567 M001"
        onBlur={(e) =>
          parseText(e.target.value)
        }
      />

      <p className="text-sm text-slate-500">
        格式：姓名 電話 會員編號
      </p>
    </div>
  )
}