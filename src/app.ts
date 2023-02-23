import ankiAxios from './ankiAxios'
import crawl, { CrawlData } from './crawl'
import { getPosition, savePosition } from './rateLimit'
import config from 'config'

export type CardAction = {
  action: string
  version: 6
  params: any
}

const getNotes = async (): Promise<any[]> => {
  const findNotes: CardAction = {
    action: 'findNotes',
    version: 6,
    params: {
      query: 'deck:current',
    },
  }

  const res = await ankiAxios.post('/', findNotes)

  const notesInfo: CardAction = {
    action: 'notesInfo',
    version: 6,
    params: {
      notes: [],
    },
  }

  const noteIds = res.data.result
  notesInfo.params.notes = noteIds
  const res1 = await ankiAxios.post('/', notesInfo)
  const notes = res1.data.result

  return notes
}

const updateNote = async (noteId: number, han: string) => {
  const updateNoteFields: CardAction = {
    action: 'updateNoteFields',
    version: 6,
    params: {
      note: {
        id: 999999999999999,
        fields: {
          han: '',
        },
      },
    },
  }

  updateNoteFields.params.note.id = noteId
  updateNoteFields.params.note.fields.han = han

  const res = await ankiAxios.post('/', updateNoteFields)
  // if (res.data.error) print(error)
}

const run = async () => {
  const position = getPosition()
  console.log(position)
  const notes = await getNotes()

  /* can't pass rate-limit */

  // for (let note of notes) {
  //   const crawledData = await crawl(note.fields.Kanji.value)
  //   console.log('Updating ', note.noteId, note.fields.Kanji.value, crawledData)
  //   await updateNote(note.noteId, crawledData)
  //   console.log('Updated  ', note.noteId, note.fields.Kanji.value)
  // }

  // use crontab instead
  // let i = position
  // while (i < position + 10) {
  //   const note = notes[i]
  //   const crawledData = await crawl(note.fields.Kanji.value)

  //   console.log('Updating ', note.noteId, note.fields.Kanji.value, crawledData)
  //   await updateNote(note.noteId, crawledData)
  //   console.log('Updated  ', note.noteId, note.fields.Kanji.value)
  //   i++
  // }
  // savePosition(i)

  // use crontab instead
  let i = position
  while (i < position + config.get<number>('KANJI_NUM')) {
    const note = notes[i]

    const crawledData = await crawl(note.fields.kanji.value)

    console.log(
      'Updating ',
      i,
      note.noteId,
      note.fields.kanji.value,
      crawledData
    )
    await updateNote(note.noteId, crawledData)
    console.log('Updated ', i, note.noteId, note.fields.kanji.value)
    i++
  }
  savePosition(i)
}

const deckNames = async () => {
  const deckName: CardAction = {
    action: 'deckNames',
    version: 6,
    params: {},
  }
  const res = await ankiAxios.post('/', deckName)
  console.log(res.data.result)
  console.log(res.data.result[33])
  return res.data.result
}

// deckNames()
run()
