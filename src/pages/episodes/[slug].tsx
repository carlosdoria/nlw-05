import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { usePlayer } from '../../context/PlayerContext'
import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

import styles from './episode.module.scss'

type IEpisode = {
  id: string
  title: string
  description: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationString: string
  url:string
}

type IEpisodeProps = {
  episode: IEpisode
}

export default function Episode ({ episode }: IEpisodeProps) {
  const context = usePlayer()

  return (
    <div className={styles.episode}>
      <Head>
        <title>
          {episode.title} | Podcast
        </title>
      </Head>

    <div className={styles.thumbnailContainer}>
      <Link href='/'>
        <button type='button'>
          <img src='/arrow-left.svg' alt='Voltar'/>
        </button>
      </Link>
      <Image
        height={160}
        width={700}
        src={episode.thumbnail}
        alt={episode.title}
        objectFit='cover'
      />
      <button type='button' onClick={ () => context.play(episode)}>
        <img src='/play.svg' alt='Tocar episódio'/>
      </button>
    </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description}}
      />
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const {data} = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return {
    paths,
    fallback: 'blocking' // Caso os arquivos estáticos não tenham sido gerados no momento da build os arquivo serão carregados no servidor node do next
    // fallback: 'false' // Caso os arquivos estáticos não tenham sido gerados no momento da build a page vai retornar um error 404
    // fallback: 'true' // Caso os arquivos estáticos não tenham sido gerados no momento da build os arquivo vão ser gerados no lado do client, isso pode gerar error caso a página rederize dados que dependem da requisição. Obs> nesse caso deve ser utilizado o router.isFallback para evitar erros
    // Fallback true e 'blocking' são conhecidos como 'incremental static regeneration'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const { slug } = ctx.params

  const { data } = await api.get(`/episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {locale: ptBR}),
    duration: Number(data.file.duration),
    durationString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  }

  return {
    props: {
      episode
    },
    revalidate: 3600 * 24
  }
}
