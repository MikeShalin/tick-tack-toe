import React from 'react'
import _ from 'lodash'
import { action, observable } from 'mobx'
import {
  emptyCell,
  cross,
  zero,
  initialArea,
  winnerPosition
} from '../config/config'
import {
  getRandomIndex,
  collectArray,
  finishGame
} from '../utils/utils'

class app {
  @observable cells = initialArea

  @observable step = 1

  @observable finishArray = []

  @action
  handleClick = positionId => {
    /** Только если ячейка пустая **/
    if (this.cells[positionId].cellBody === emptyCell) {

      /** Первый ходит человек - ходит крестиком **/

      this.cells[positionId] = { id: positionId, cellBody: cross }
      const cellsArray = Object.values(this.cells)

      /** Если не победитель делаем ход компьютером **/
      if (!this.isWinner(cross, winnerPosition, cellsArray)) {

        /**
         * собираем массив ноликов - currOpponentCellArray
         *  собираем массив крестиков - currPlayerCellArray
         *  запускаем функцию компьютера
         **/

        const computerCellArray = collectArray(cellsArray, zero)
        const playerCellArray = collectArray(cellsArray, cross)
        this.opponentGo(computerCellArray, playerCellArray, winnerPosition)
      }

    }
  }

  @action
  opponentGo = (
    computerCellArray,
    playerCellArray,
    winnerPosition
  ) => {

    let currWinnerPosition = []

    /** Пробегаем по массиву массивов выйгрышных позиций **/
    winnerPosition.forEach(positionsList => {

      /** Складываем значения, не включенных в массивы **/
      const diffWinnerAndPlayerPosition = _.difference(positionsList, playerCellArray)

      /** Игрок не занял выйгрышную позицию на поле **/
      if (diffWinnerAndPlayerPosition.length === positionsList.length) {
        currWinnerPosition = [...currWinnerPosition, positionsList.filter(position => (

            /** Проверяем не занял ли компьютер эту позицию **/
            !computerCellArray.includes(position)
          )
        )]
      }
    })

    /** Берем рандомную позицию **/
    const subArray = currWinnerPosition[getRandomIndex(currWinnerPosition)]
    const id = subArray[getRandomIndex(subArray)]

    /** Мы знаем что компьютер играет ноликами **/
    this.cells[id] = { id, cellBody: zero }

    /** Проверяем на победителя **/
    this.isWinner(zero, winnerPosition, Object.values(this.cells))
  }


  /** Проверка на победителя **/

  @action
  isWinner = (
    currPlayer,
    winnerPosition,
    cell
  ) => {
    /** В переменную попадают выйгрышные позиции **/
    this.finishArray = finishGame(cell, currPlayer, winnerPosition)
    if (this.finishArray.length) {
      alert(`${currPlayer} is won`)
      this.cells = initialArea
      return true
    } else {
      return false
    }
  }
}

export default app