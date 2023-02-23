import axios from 'axios'
import { load } from 'cheerio'

const url = 'https://hvdic.thivien.net/whv/'

export type CrawlData = {
  [key: string]: string
}

const crawl = async (kanji: string) => {
  const { data } = await axios.get(url + kanji)
  const $ = load(data)

  const crawledData: CrawlData = {}

  const spell = $('.hvres')
    .children('.hvres-header')
    .children('.hvres-definition')
    .children('.hvres-spell')

  spell.each((i, e) => {
    const detailElement = $(e).parent().parent().next('.hvres-details')
    const hvresSourceElement = detailElement.children('.hvres-source').first()
    if (hvresSourceElement.text() === 'Từ điển phổ thông') {
      crawledData[$(e).text().trim()] = hvresSourceElement.next().text()
    } else {
      crawledData[$(e).text().trim()] = ''
    }
  })

  let res: string = ''
  Object.keys(crawledData).map((k) => {
    if (crawledData[k] === '') res += k + '<br>'
    else res += k + ': ' + crawledData[k].split('\n').join(', ') + '<br>'
  })
  res.slice(0, -4)
  return res
}

export default crawl
