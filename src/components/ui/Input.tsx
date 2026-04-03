import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string // текст ошибки — если есть, поле подсвечивается красным
}

function Input({ label, error, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="input-group">
      <label className="input-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...rest}
      />
      {error && (
        <span className="input-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input
