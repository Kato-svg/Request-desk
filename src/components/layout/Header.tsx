import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

function Header() {
  const { currentUser, logout } = useAuth()

  return (
    <header className="header">
      <div className="header__inner">
        {/* Логотип */}
        <Link to="/tickets" className="header__logo">
          <span className="header__logo-icon">⬡</span>
          RequestDesk
        </Link>

        {/* Правая часть */}
        <div className="header__right">
          {currentUser && (
            <>
              <span className="header__user">{currentUser.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Выйти
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
