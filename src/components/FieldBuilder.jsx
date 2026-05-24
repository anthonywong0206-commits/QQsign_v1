export default function FieldBuilder({
  fields,
  setFields
}) {
  const addField = () => {
    setFields([
      ...fields,
      {
        label: '',
        type: 'text'
      }
    ])
  }

  const updateField = (index, key, value) => {
    const updated = [...fields]

    updated[index][key] = value

    setFields(updated)
  }

  const removeField = (index) => {
    const updated = [...fields]

    updated.splice(index, 1)

    setFields(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">
          自訂欄位
        </h3>

        <button
          onClick={addField}
          className="bg-slate-900 text-white rounded-xl px-4 py-2"
        >
          新增欄位
        </button>
      </div>

      {fields.map((field, index) => (
        <div
          key={index}
          className="border rounded-2xl p-4 space-y-3"
        >
          <input
            value={field.label}
            onChange={(e) =>
              updateField(
                index,
                'label',
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
            placeholder="欄位名稱"
          />

          <select
            value={field.type}
            onChange={(e) =>
              updateField(
                index,
                'type',
                e.target.value
              )
            }
            className="w-full border rounded-xl p-3"
          >
            <option value="text">文字</option>
            <option value="number">數字</option>
            <option value="select">下拉選單</option>
          </select>

          <button
            onClick={() => removeField(index)}
            className="text-red-500 text-sm"
          >
            刪除欄位
          </button>
        </div>
      ))}
    </div>
  )
}