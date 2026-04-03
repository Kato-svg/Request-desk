import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

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
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo-icon">⬡</span>
          <h1 className="login-title">RequestDesk</h1>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
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
            <div className="login-auth-error" role="alert">
              {authError}
            </div>
          )}

          <Button type="submit" variant="primary" className="login-submit">
            Войти
          </Button>
        </form>
        <div className="login-hint">
          <p>Тестовый вход:</p>
          <p>maria@requestdesk.ru / password123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
