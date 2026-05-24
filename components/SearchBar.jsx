export default function SearchBar({
  keyword,
  setKeyword
}) {
  return (
    <input
      value={keyword}
      onChange={(e) =>
        setKeyword(e.target.value)
      }
      className="w-full border rounded-2xl p-4"
      placeholder="搜尋姓名／電話"
    />
  )
}