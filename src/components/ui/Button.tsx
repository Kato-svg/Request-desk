import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary: styles.btnPrimary,
  secondary: styles.btnSecondary,
  danger: styles.btnDanger,
  ghost: styles.btnGhost,
}

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.btnSm,
  md: styles.btnMd,
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        styles.btn,
        variantClass[variant],
        sizeClass[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
