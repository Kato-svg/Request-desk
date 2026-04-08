import clsx from 'clsx'
import styles from './TableSkeleton.module.css'

type TableSkeletonProps = {
  rows?: number
  cols?: number
}

function TableSkeleton({ rows = 8, cols = 7 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className={styles.tableSkeletonCell}>
              <div className={clsx(styles.skeleton, styles.skeletonText)} />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton
