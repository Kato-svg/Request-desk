import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import styles from './LoginPage.module.css'

type FormErrors = {
  email?: string
  password?: string
}

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})

  const [authError, setAuthError] = useState('')

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Введите email'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Некорректный формат email'
    }

    if (!password) {
      newErrors.password = 'Введите пароль'
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setAuthError('')

    if (!validate()) return

    // Пробуем залогиниться
    const success = login(email, password)

    if (success) {
      navigate('/tickets')
    } else {
      setAuthError('Неверный email или пароль')
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <span className={styles.loginLogoIcon}>⬡</span>
          <h1 className={styles.loginTitle}>RequestDesk</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className={styles.loginForm}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.ru"
            error={errors.email}
            autoComplete="email"
          />

          <Input
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
            autoComplete="current-password"
          />
          {authError && (
            <div className={styles.loginAuthError} role="alert">
              {authError}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className={styles.loginSubmit}
          >
            Войти
          </Button>
        </form>
        <div className={styles.loginHint}>
          <p>Тестовый вход:</p>
          <p>maria@requestdesk.ru / password123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
