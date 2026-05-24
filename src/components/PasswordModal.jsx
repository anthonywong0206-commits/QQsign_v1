import { useState } from 'react'

export default function PasswordModal({
  onClose,
  onSuccess,
  correctPassword
}) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (password === correctPassword) {
      onSuccess()
    } else {
      setError('密碼錯誤')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold">
          輸入管理密碼
        </h2>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border rounded-2xl p-4"
          placeholder="輸入密碼"
        />

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="bg-slate-200 rounded-2xl p-3"
          >
            取消
          </button>

          <button
            onClick={handleSubmit}
            className="bg-slate-900 text-white rounded-2xl p-3"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  )
}