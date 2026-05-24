export default function LogoUploader({
  logo,
  setLogo
}) {
  const handleUpload = (e) => {
    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      setLogo(reader.result)
    }

    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-3">
      <label className="font-semibold">
        上載 Logo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full border rounded-2xl p-3"
      />

      {logo && (
        <img
          src={logo}
          className="w-24 h-24 rounded-2xl object-cover border"
        />
      )}
    </div>
  )
}