const PDFParser = require('pdf-parse');
const fs = require('fs');
const path = require('path');

let wordList = []
const stringList = []
const directoryPath = './pdf';
const chunkSize = 8;

// 读取文件夹下所有文件
const files = fs.readdirSync(directoryPath);
// 过滤出pdf文件
const pdfFiles = files.filter((file) => path.extname(file).toLowerCase() === '.pdf');

const init = async () => {
  // 读取文件夹下所有pdf文件
  for (let i = 0; i < pdfFiles.length; i++) {
    const fileName = pdfFiles[i];
    const dataBuffer = fs.readFileSync(`${directoryPath}/${fileName}`);
    const data = await PDFParser(dataBuffer);
    const pdfFileName = fileName.replace('.pdf', '')
    // 去除空行和文件名和数字
    const words = data.text.split('\n').filter(item => Boolean(item) && item !== pdfFileName && isNaN(Number(item)))
    wordList = [...wordList, ...words]
  }

  // 按照chunkSize分割数组
  for (let i = 0; i < wordList.length; i += chunkSize) {
    const chunk = wordList.slice(i, i + chunkSize);
    const string = `（${chunk.join(',')}）`
    stringList.push(string);
  }

  // 写入文件
  fs.writeFileSync('./result.txt', stringList.join('\n'));
}

init()