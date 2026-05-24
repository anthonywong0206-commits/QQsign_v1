export default function ActivityManager({
  activities,
  setActivities,
  currentActivity,
  setCurrentActivity
}) {
  const addActivity = () => {
    const name = prompt('輸入活動名稱')

    if (!name) return

    const activity = {
      id: Date.now(),
      name
    }

    setActivities([...activities, activity])
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          活動管理
        </h2>

        <button
          onClick={addActivity}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl"
        >
          新增活動
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() =>
              setCurrentActivity(activity)
            }
            className={`w-full text-left p-4 rounded-2xl border ${
              currentActivity?.id ===
              activity.id
                ? 'bg-slate-900 text-white'
                : 'bg-white'
            }`}
          >
            {activity.name}
          </button>
        ))}
      </div>
    </div>
  )
}