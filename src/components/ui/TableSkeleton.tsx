type TableSkeletonProps = {
  rows?: number
  cols?: number
}

function TableSkeleton({ rows = 8, cols = 7 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="table-skeleton-row">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="table-cell">
              <div className="skeleton skeleton--text" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton
