
export default function Sidebar({ data, canShowHeader }) {
  return (
    <>
    {canShowHeader && <div className="text-active mb-8 mt-10">{data.heading}</div>}
      <div className="text-secondary">{data.subheading}s</div>
    </>
  )
}
