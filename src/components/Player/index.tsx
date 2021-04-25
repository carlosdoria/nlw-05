import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

import { PlayerContext } from '../../context/PlayerContext'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './styles.module.scss'

export function Player () {
  const context = useContext(PlayerContext)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentEpisode = context.episodeList[context.currentEpisodeIndex]

  const [ progress, setProgress] = useState(0)

  function setupProgressListener () {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek (amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleEpisodeEnded () {
    if (context.hasNext) {
      context.playNext()
    } else {
      context.clearPlayerState()
    }
  }

  useEffect(() => {
    if (!audioRef.current) return

    if (context.isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [context.isPlaying])

  return (
    <div className={styles.playerContainer}>

      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora!</strong>
      </header>

      { currentEpisode ? (
        <div className={styles.currentEpisode}>
          <Image
            height={592}
            width={592}
            src={currentEpisode.thumbnail}
            objectFit={'cover'}
          />
          <strong>{currentEpisode.title}</strong>
          <span>{currentEpisode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir.</strong>
        </div>
      ) }

      <footer className={!currentEpisode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>

          { currentEpisode ? (
            <Slider
              max={currentEpisode.duration}
              value={progress}
              onChange={handleSeek}
              trackStyle={{ backgroundColor: '#04d361' }}
              railStyle={{ backgroundColor: '#9f75ff' }}
              handleStyle={{ borderColor: '#04d361' }}
            />
          ) : (
            <div className={styles.slider}>
              <div className={styles.emptySlider} />
            </div>
          )}
          <span>{convertDurationToTimeString(currentEpisode?.duration ?? 0)}</span>
        </div>

        { currentEpisode && (
          <audio
            ref={audioRef}
            src={currentEpisode.url}
            autoPlay
            onEnded={handleEpisodeEnded}
            loop={context.isLooping}
            onPlay={() => context.setPlayingState(true)}
            onPause={() => context.setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!currentEpisode || context.episodeList.length === 1}
            onClick={context.toggleIshuffle}
            className={context.isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt='Embaralhar'/>
          </button>
          <button type='button' onClick={() => context.playPrevious()} disabled={!currentEpisode || !context.hasPrevious}>
            <img src="/play-previous.svg" alt='Tocar anterior'/>
          </button>
          <button
            type='button'
            className={styles.playButton}
            disabled={!currentEpisode}
            onClick={context.togglePlay}
          >
            { context.isPlaying
              ? <img src="/pause.svg" alt='Tocar'/>
              : <img src="/play.svg" alt='Tocar'/>
            }
          </button>
          <button
            type='button'
            onClick={() => context.playNext()}
            disabled={!currentEpisode || !context.hasNext}
          >
            <img src="/play-next.svg" alt='Tocar próxima'/>
          </button>
          <button
            type='button'
            disabled={!currentEpisode}
            onClick={context.toggleLoop}
            className={context.isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt='Repetir'/>
          </button>

        </div>
      </footer>
    </div>
  )
}
