const cds = require('@sap/cds')
// 絵文字の定義
const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "🥹", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍"]
//our business logic...
function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)]
}
// すべてのサービスがブートストラップされ、
// expressに追加されたタイミングで発生するイベントでロジックを追加する
cds.once('served', () => {
  // すべてのサービス、エンティティをトラバースして@randomEmojiアノテーションがついている項目を探す
  for (let srv of cds.services) {
    for (let entity of srv.entities) {
      const emojiElements = []
      for (const key in entity.elements) {
        const element = entity.elements[key]
        // 項目に@randomEmojiアノテーションがついているかをチェック
        if (element['@randomEmoji']) emojiElements.push(element.name)
      }
      // アノテーション付きの項目がある場合、READオペレーションの後に呼ばれるイベントハンドラを登録
      if (emojiElements.length) {
        srv.after('READ', entity, data => {
          if (!data) return
          // 単一レコードを取得した場合は配列にならないので、配列にする
          let myData = Array.isArray(data) ? data : [data]
          // アノテーションがついている項目を探して絵文字を追加
          for (let entry of myData) {
            for (const element of emojiElements) {
              if (entry[element]) {
                entry[element] += getRandomEmoji()
              }
            }
          }
        })
      }
    }
  }
})