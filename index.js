const path = require('path')
const fs = require('fs')
const https = require('https')
const list = require('./toDownload')

const STORAGE_URL = 'https://storage.hermapartprojects.org'
const OUTPUT_PATH = path.join(process.cwd(), 'output')

const download = function(uri, filename) {
  const file = fs.createWriteStream(filename)
  https.get(uri, (response) => { response.pipe(file) })
}

const folderTree = list.map((url) => {
  const paths = url.split('/')
  paths.pop()

  return paths.join('/')
})

const saveFolderTree = (paths) => {
  const setPath = new Set()
  paths.forEach((pathSrc) => setPath.add(pathSrc));

  [...setPath].forEach((pathSrc) => {
    fs.mkdirSync(
      path.join(OUTPUT_PATH, pathSrc),
      { recursive: true },
      (err, created) => {
        if (err) return console.log(err)

        created ? console.log("folder created:", created) :
          console.log("folder already exists:", pathSrc)
      },
    )
  })
}

saveFolderTree(folderTree)

list.forEach((file) => {
  download(`${STORAGE_URL}/${file}`, `${OUTPUT_PATH}/${file}`)
})

