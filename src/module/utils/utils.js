import _ from 'lodash'

export function getRandomIndex(array) {
  return _.random(0, array.length - 1)
}

/** собираем массив id по параметру ячеек (специально для этой задачи
 * мы знаем какие ключи будут в объекте **/
export function collectArray(enterArray, attrSearch) {
  let outputArray = []
  enterArray.forEach(({ id, cellBody }) => {
    if (cellBody === attrSearch) {
      outputArray = [...outputArray, id]
    }
  })
  return outputArray
}

export function finishGame(cells, testBody, winnerPosition) {

  /** Собираем массив из чекнутых ячеек **/
  const testPosition = collectArray(cells, testBody)

  /** Проверяем если наш массив совпадает с массивом выйгрышных позиций
   * возвращаем true**/
  return winnerPosition.filter(position => (
    !_.difference(position, testPosition).length)
  )
}
