import clsx from 'clsx'
import styles from './Spinner.module.css'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass = {
  sm: styles.spinnerSm,
  md: styles.spinnerMd,
  lg: styles.spinnerLg,
}

function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={clsx(styles.spinner, sizeClass[size])}
      role="status"
      aria-label="Загрузка"
    />
  )
}

export default Spinner
