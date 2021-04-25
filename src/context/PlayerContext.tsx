import { createContext, ReactNode, useContext, useState } from 'react'

type IEpisode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type IPlaeyerContext = {
  episodeList: IEpisode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode: IEpisode) => void
  playList: (list: IEpisode[], index: number) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleIshuffle: () => void
  setPlayingState: (state: boolean) => void
  clearPlayerState: () => void
  hasPrevious:boolean
  hasNext:boolean
  playNext: () => void
  playPrevious: () => void
}

type IPlayerContextProvider = {
  children: ReactNode
}

export const PlayerContext = createContext({} as IPlaeyerContext)

export function PlayerContextProvider ({ children }: IPlayerContextProvider ) {

  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play (episode: IEpisode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList (list: IEpisode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function togglePlay () {
    setIsPlaying(!isPlaying)
  }

  function toggleLoop () {
    setIsLooping(!isLooping)
  }

  function toggleIshuffle () {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState () {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext () {
    if ( isShuffling) {
      const nestRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nestRandomEpisodeIndex)
    } else if ( hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious () {
    if ( hasPrevious ) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }


  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        play,
        playList,
        togglePlay,
        toggleLoop,
        toggleIshuffle,
        setPlayingState,
        clearPlayerState,
        hasPrevious,
        hasNext,
        playNext,
        playPrevious
      }}
    >
      { children }
    </PlayerContext.Provider>

  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
