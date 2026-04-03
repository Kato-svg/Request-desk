type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
}

function Spinner({ size = 'md' }: SpinnerProps) {
  return (
    <div
      className={`spinner spinner--${size}`}
      role="status"
      aria-label="Загрузка"
    />
  )
}

export default Spinner
