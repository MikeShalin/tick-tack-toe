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

/** Максимально часто повторяющийся элемент **/
export function maxRepetitions(arr) {
  let test = {}
  arr.forEach((el, i) => {
    if (el === arr[i + 1]) {
      if (!test[el]) test[el] = 2
      else test[el] += 1
    }
  })

  let max = 0
  let maxKey = []
  for (let key in test) {
    if (test.hasOwnProperty(key)) {
      if (test[key] > max) {
        maxKey = key
        max = test[key]
      }
    }
  }

  return maxKey
}

export function getBestPosition(pathLength, currLength) {
  return currLength < pathLength ? currLength : pathLength
}

export function playerAttack(computerCellArray, winnerPosition) {
  /** Собираем варианты для хода **/
  let bestWinnerPositions

  winnerPosition.forEach(positionsList => {

    /** Позиции которые осталось закрыть компьютеру **/
    const diffWinnerAndComputerPosition = _.difference(positionsList, computerCellArray)

    diffWinnerAndComputerPosition.forEach(positionId => {
      if (diffWinnerAndComputerPosition.length === 1) {

        /** Остался один ход до победы программы, даем самый большой вес **/
        bestWinnerPositions = {
          id: positionId,
          weight: 3
        }
      }
    })
  })

  return bestWinnerPositions
}


