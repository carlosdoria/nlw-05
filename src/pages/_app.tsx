import '../styles/globalStyles.scss'

import { Header, Player } from '../components'

import styles from '../styles/app.module.scss'
import { PlayerContextProvider } from '../context/PlayerContext'

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp