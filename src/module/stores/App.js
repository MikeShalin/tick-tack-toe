import React from 'react'
import _ from 'lodash'
import { action, observable } from 'mobx'

const emptyCell = '|___|'

const cross = '|_X_|'

const zero = '|_0_|'

const initialArea =
  {
    1: { id: 1, cellBody: emptyCell },
    2: { id: 2, cellBody: emptyCell },
    3: { id: 3, cellBody: emptyCell },
    4: { id: 4, cellBody: emptyCell },
    5: { id: 5, cellBody: emptyCell },
    6: { id: 6, cellBody: emptyCell },
    7: { id: 7, cellBody: emptyCell },
    8: { id: 8, cellBody: emptyCell },
    9: { id: 9, cellBody: emptyCell },
  }


const winnerPosition = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], /** 3 клетки по горизонтали **/
  [1, 4, 7], [2, 5, 8], [3, 6, 9], /** 3 клетки по вертикали **/
  [1, 5, 9], [2, 5, 7]             /** 3 клетки по диагонали **/
]

class app {
  @observable cells = initialArea

  @observable step = 0

  @observable finishArray = []

  @action
  handleClick = (positionId) => {
    /** Только если ячейка пустая **/
    if (this.cells[positionId].cellBody === emptyCell) {

      /** Определяем кто сейчас ходит **/
      const currPlayer = this.currStep(this.step++)
      this.cells[positionId] = { id: positionId, cellBody: currPlayer }

      /** В переменную попадают выйгрышные позиции **/
      this.finishArray = this.finishGame(Object.values(this.cells), currPlayer, winnerPosition)
      if (this.finishArray.length) {
        alert('you win')
        this.cells = initialArea
      }
    }
  }

  /** Первые ходят крестики, вторые нолики **/
  currStep = (step) => step % 2 ? cross : zero

  finishGame = (cells, testBody, winnerPosition) => {
    let testPosition = []

    /** Собираем массив из чекнутых ячеек **/
    cells.forEach(({ id, cellBody }) => {
      if (cellBody === testBody) {
        testPosition = [...testPosition, id]
      }
    })

    /** Проверяем если наш массив совпадает с массивом выйгрышных позиций
     * возвращаем true**/
    return winnerPosition.filter(position => (
      !_.difference(position, testPosition).length)
    )
  }
}

export default app