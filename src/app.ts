import ankiAxios from './ankiAxios'
import crawl, { CrawlData } from './crawl'

type CardAction = {
  action: string
  version: 6
  params: any
}

const DECKNAME = 'Kanji'

const getNotes = async (): Promise<any[]> => {
  const findNotes: CardAction = {
    action: 'findNotes',
    version: 6,
    params: {
      query: DECKNAME,
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
  console.log('UPDATENOTE', noteId, han)

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
  const notes = await getNotes()

  for (let note of notes) {
    const crawledData = await crawl(note.fields.Kanji.value)

    console.log('Updating ', note.noteId, note.fields.Kanji.value, crawledData)
    // await updateNote(note.noteId, formatedData)
    console.log('Updated  ', note.noteId, note.fields.Kanji.value)
  }
}
run()
