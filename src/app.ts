import ankiAxios from './ankiAxios'
import crawl, { CrawlData } from './crawl'

type CardAction = {
  action: string
  version: 6
  params: any
}

const deckName = 'Kanji'

const getDeckStats: CardAction = {
  action: 'getDeckStats',
  version: 6,
  params: {
    decks: [deckName],
  },
}

const findNotes: CardAction = {
  action: 'findNotes',
  version: 6,
  params: {
    query: deckName,
  },
}

const notesInfo: CardAction = {
  action: 'notesInfo',
  version: 6,
  params: {
    notes: [],
  },
}

const getNotes = async (): Promise<any[]> => {
  const res = await ankiAxios.post('/', findNotes)
  if (res.data.error !== null) {
    throw new Error(res.data.error)
  }
  const noteIds = res.data.result
  notesInfo.params.notes = noteIds

  const res1 = await ankiAxios.post('/', notesInfo)
  const notes = res1.data.result

  return notes
}

const getKanjiCharacter = (arr: any[]): string[] => {
  const kanji: string[] = []
  for (let note of arr) {
    kanji.push(note.fields.Kanji.value)
  }
  return kanji
}

const formatData = (data: CrawlData) => {
  let res: string = ''
  Object.keys(data).map((k) => {
    res += k + ': ' + data[k].split('\n').join(', ') + '\n'
  })
  return res.trim()
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
}

const run = async () => {
  const notes = await getNotes()

  for (let note of notes) {
    const crawledData = await crawl(note.fields.Kanji.value)
    const formatedData = formatData(crawledData)

    console.log(
      'Updating... ',
      note.noteId,
      note.fields.Kanji.value,
      formatedData
    )
    // await updateNote(note.noteId, formatedData)
    console.log('Updated!!! ', note.noteId, note.fields.Kanji.value)
  }
}
run()
