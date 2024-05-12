
export default function Sidebar({ data, canShowHeader, active }) {
  return (
    <>
    {canShowHeader && <div className="text-active mb-8 mt-10">{data.heading}</div>}
      <div className={`text-secondary ${active && "text-secondary-active"}`}>{data.subheading}</div>
    </>
  )
}
