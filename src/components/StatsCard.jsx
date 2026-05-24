export default function StatsCard({
  records
}) {
  const total = records.length

  const today =
    new Date().toLocaleDateString()

  const todayCount = records.filter(
    (r) =>
      new Date(
        r.time
      ).toLocaleDateString() === today
  ).length

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="text-sm text-slate-500">
          總簽到人數
        </div>

        <div className="text-3xl font-bold mt-2">
          {total}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="text-sm text-slate-500">
          今日簽到
        </div>

        <div className="text-3xl font-bold mt-2">
          {todayCount}
        </div>
      </div>
    </div>
  )
}