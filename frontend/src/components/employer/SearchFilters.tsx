// Filter panel (skills, location, rate)

export function SearchFilters() {
  return (
    <div className="filters">
      <input type="text" placeholder="Skills" />
      <input type="text" placeholder="Location" />
      <input type="number" placeholder="Min Rate" />
      <input type="number" placeholder="Max Rate" />
    </div>
  )
}
