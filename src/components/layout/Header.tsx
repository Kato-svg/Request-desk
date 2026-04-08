import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import styles from './Header.module.css'

function Header() {
  const { currentUser, logout } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/tickets" className={styles.headerLogo}>
          <span className={styles.headerLogoIcon}>⬡</span>
          RequestDesk
        </Link>

        <div className={styles.headerRight}>
          {currentUser && (
            <>
              <span className={styles.headerUser}>{currentUser.name}</span>
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
