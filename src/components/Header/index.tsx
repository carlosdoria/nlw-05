import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'

export function Header () {
  const currentDate = format(new Date(), 'EEEEEE, d MMM', {
    locale: ptBR
  })

  return (
    <header className={styles.heardeContainer}>
      <img src='/logo.svg' alt='Podcast'/>

      <p>O melhor para você ouvir, sempre.</p>

      <span>{currentDate}</span>
    </header>
  )
}
