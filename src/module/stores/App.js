import React from 'react'
import _ from 'lodash'
import { action, observable } from 'mobx'
import {
  emptyCell,
  cross,
  zero,
  initialArea,
  winnerPosition,
  winnerName
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
    let bestPosition = 5
    let id
    let bestPositionStep = 3
    let bestWinnerPositions = []

    /** Пробегаем по массиву массивов выйгрышных позиций **/
    winnerPosition.forEach(positionsList => {

      /** Складываем значения, не включенных в массивы **/
      const diffWinnerAndPlayerPosition = _.difference(positionsList, playerCellArray)

      /** Если игрок почти победил, занимаем эту позицию **/
      if (diffWinnerAndPlayerPosition.length < 2) {
        bestPosition = diffWinnerAndPlayerPosition[0]
      }

      /** Игрок не занял выйгрышную позицию на поле **/
      if (diffWinnerAndPlayerPosition.length === positionsList.length) {
        /** Проверяем не занял ли компьютер эту позицию **/
        currWinnerPosition = [...currWinnerPosition, this.getComputerCell(positionsList, computerCellArray)]
      }
    })

    /** Выбираем самый короткий путь до победы **/
    currWinnerPosition.forEach(positionsList => {
      const diffWinnerAndComputerPosition = _.difference(positionsList, computerCellArray)

      /** Если компьютер почти победил, занимаем эту позицию **/
      if (diffWinnerAndComputerPosition.length < 2) {
        bestPosition = diffWinnerAndComputerPosition[0]
      }

      if (diffWinnerAndComputerPosition.length <= bestPositionStep) {

        /** Обновляем путь до победы **/
        bestPositionStep = diffWinnerAndComputerPosition.length
        bestWinnerPositions = [...bestWinnerPositions, positionsList]
      }
    })

    /** Выйграшных позиций не осталось **/
    if (!bestWinnerPositions.length) {
      this.gameOver()
      return false
    }

    /** Проверяем занята ли лучшая позиция **/
    if (!computerCellArray.includes(bestPosition) && !playerCellArray.includes(bestPosition)) {
      /** Занимаем лучшую позицию **/
      id = bestPosition
    } else {

      /** Берем рандомную позицию **/
      const subArray = bestWinnerPositions[getRandomIndex(bestWinnerPositions)]
      id = subArray[getRandomIndex(subArray)]
    }

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
      alert(`${winnerName[currPlayer]} is won`)
      this.cells = initialArea
      return true
    } else {
      return false
    }
  }

  @action
  gameOver = () => {
    alert('game over')
    this.cells = initialArea
  }

  getComputerCell = (positions, computerPositionsArray) => (
    positions.filter(position => !computerPositionsArray.includes(position))
  )
}

export default app