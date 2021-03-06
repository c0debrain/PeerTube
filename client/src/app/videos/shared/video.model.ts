import { Video as VideoServerModel, VideoFile } from '../../../../../shared'
import { User } from '../../shared'

export class Video implements VideoServerModel {
  author: string
  by: string
  createdAt: Date
  categoryLabel: string
  category: number
  licenceLabel: string
  licence: number
  languageLabel: string
  language: number
  description: string
  duration: number
  durationLabel: string
  id: number
  uuid: string
  isLocal: boolean
  name: string
  podHost: string
  tags: string[]
  thumbnailPath: string
  thumbnailUrl: string
  previewPath: string
  previewUrl: string
  views: number
  likes: number
  dislikes: number
  nsfw: boolean
  files: VideoFile[]

  private static createByString (author: string, podHost: string) {
    return author + '@' + podHost
  }

  private static createDurationString (duration: number) {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    const minutesPadding = minutes >= 10 ? '' : '0'
    const secondsPadding = seconds >= 10 ? '' : '0'

    return minutesPadding + minutes.toString() + ':' + secondsPadding + seconds.toString()
  }

  constructor (hash: {
    author: string,
    createdAt: string,
    categoryLabel: string,
    category: number,
    licenceLabel: string,
    licence: number,
    languageLabel: string
    language: number
    description: string,
    duration: number
    id: number,
    uuid: string,
    isLocal: boolean,
    name: string,
    podHost: string,
    tags: string[],
    thumbnailPath: string,
    previewPath: string,
    views: number,
    likes: number,
    dislikes: number,
    nsfw: boolean,
    files: VideoFile[]
  }) {
    this.author = hash.author
    this.createdAt = new Date(hash.createdAt)
    this.categoryLabel = hash.categoryLabel
    this.category = hash.category
    this.licenceLabel = hash.licenceLabel
    this.licence = hash.licence
    this.languageLabel = hash.languageLabel
    this.language = hash.language
    this.description = hash.description
    this.duration = hash.duration
    this.durationLabel = Video.createDurationString(hash.duration)
    this.id = hash.id
    this.uuid = hash.uuid
    this.isLocal = hash.isLocal
    this.name = hash.name
    this.podHost = hash.podHost
    this.tags = hash.tags
    this.thumbnailPath = hash.thumbnailPath
    this.thumbnailUrl = API_URL + hash.thumbnailPath
    this.previewPath = hash.previewPath
    this.previewUrl = API_URL + hash.previewPath
    this.views = hash.views
    this.likes = hash.likes
    this.dislikes = hash.dislikes
    this.nsfw = hash.nsfw
    this.files = hash.files

    this.by = Video.createByString(hash.author, hash.podHost)
  }

  isRemovableBy (user) {
    return user && this.isLocal === true && (this.author === user.username || user.isAdmin() === true)
  }

  isBlackistableBy (user) {
    return user && user.isAdmin() === true && this.isLocal === false
  }

  isUpdatableBy (user) {
    return user && this.isLocal === true && user.username === this.author
  }

  isVideoNSFWForUser (user: User) {
    // If the video is NSFW and the user is not logged in, or the user does not want to display NSFW videos...
    return (this.nsfw && (!user || user.displayNSFW === false))
  }

  getDefaultMagnetUri () {
    if (this.files === undefined || this.files.length === 0) return ''

    // TODO: choose the original file
    return this.files[0].magnetUri
  }

  patch (values: Object) {
    Object.keys(values).forEach((key) => {
      this[key] = values[key]
    })
  }

  toJSON () {
    return {
      author: this.author,
      createdAt: this.createdAt,
      category: this.category,
      licence: this.licence,
      language: this.language,
      description: this.description,
      duration: this.duration,
      id: this.id,
      isLocal: this.isLocal,
      name: this.name,
      podHost: this.podHost,
      tags: this.tags,
      thumbnailPath: this.thumbnailPath,
      views: this.views,
      likes: this.likes,
      dislikes: this.dislikes,
      nsfw: this.nsfw,
      files: this.files
    }
  }
}
