import axios from 'axios'
import { load } from 'cheerio'

const url = 'https://hvdic.thivien.net/whv/'

export type CrawlData = {
  [key: string]: string
}

const crawl = async (kanji: string) => {
  const { data } = await axios.get(url + kanji)
  const $ = load(data)

  const result: CrawlData = {}

  const spell = $('.hvres')
    .children('.hvres-header')
    .children('.hvres-definition')
    .children('.hvres-spell')

  spell.each((i, e) => {
    const detailElement = $(e).parent().parent().next('.hvres-details')
    const hvresSourceElement = detailElement.children('.hvres-source').first()
    if (hvresSourceElement.text() === 'Từ điển phổ thông') {
      result[$(e).text().trim()] = hvresSourceElement.next().text()
    } else {
      result[$(e).text().trim()] = ''
    }
  })

  return result
}

export default crawl
