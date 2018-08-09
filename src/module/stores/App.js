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
  finishGame,
  maxRepetitions,
  getBestPosition,
  playerAttack
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

    let bestPosition = 5
    let bestWinnerPositions = {
      1: { id: 1, weight: 1 },
      2: { id: 2, weight: 0 }, /** Назначаем стоимость клетки **/
      3: { id: 3, weight: 1 }, /**  ------------- **/
      4: { id: 4, weight: 0 }, /**  | 1 | 0 | 1 | **/
      5: { id: 5, weight: 2 }, /**  | 0 | 2 | 0 | **/
      6: { id: 6, weight: 0 }, /**  | 1 | 0 | 1 |  **/
      7: { id: 7, weight: 1 }, /**  ------------- **/
      8: { id: 8, weight: 0 }, /** В центре самая дорогая позиция **/
      9: { id: 9, weight: 1 }, /** По углам дешевле **/
    }

    //TODO при постановке игрока 5, 1 , прграммы 9, программа ставит на 2, а хотелось бы на 3

    /** Игрок занял центр **/
      if (!_.difference(playerCellArray, [bestPosition]).length) {

        /** Уже нет разницы, но главное занять углы - т.к. они дороже **/
        const corners = [1, 3, 7, 9]
        bestPosition = corners[getRandomIndex(corners)]

      } else {

        /** Если следующий ф-ия вернет false игра окончена **/
        const nextStep = this.playerDefending(
          winnerPosition,
          playerCellArray,
          computerCellArray
        )

        let maxWeight = 0

        if (nextStep) {

            /** Назначаем новую цену клеткам **/
            Object.values(nextStep).forEach(({ id, weight }) => {

            /** Находим самую дорогую позицию **/
            if (maxWeight < weight && !computerCellArray.includes(id)) {
              maxWeight = weight
              bestPosition = id
            }
          })
        } else {
          return false
        }

      }

    /** Мы знаем что компьютер играет ноликами **/
    this.cells[bestPosition] = { id: bestPosition, cellBody: zero }

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
    return false
  }

  playerDefending = (
    winnerPosition,
    playerCellArray,
    computerCellArray
  ) => {

    /** Массив нужен для определения конца игры, т.к. нет прастранства для хода**/
    let allWinnerPosition = []

    /** Лучший ход компа в конце **/
    let finalyStepForCPU = []

    /** Массив нужен для сбора оставшихся ячеек выйграшных позиций **/
    let priority = []

    /** Ищем максимально короткий путь до победы **/
    let bestPositionStep = 3

    /** Собираем варианты для хода **/
    const bestWinnerPositions = {}

    winnerPosition.forEach(positionsList => {

      /** Позиции которые осталось закрыть игроку **/
      const diffWinnerAndPlayerPosition = _.difference(positionsList, playerCellArray)

      /** Собираем выйграшные позиции **/
      allWinnerPosition = [...allWinnerPosition, (

        /** Только если есть варианты выйгрыша **/
        diffWinnerAndPlayerPosition.length > 2 ? diffWinnerAndPlayerPosition : []
      )]

      diffWinnerAndPlayerPosition.forEach(positionId => {
        if (diffWinnerAndPlayerPosition.length === 3) {

          /** Если программа хочет занять позицию игрока,
           * просто присвоим переменной false
           **/
          finalyStepForCPU = playerAttack(computerCellArray, winnerPosition)
          finalyStepForCPU = finalyStepForCPU &&
            !playerCellArray.includes(finalyStepForCPU.id) &&
            finalyStepForCPU
        }
        if (diffWinnerAndPlayerPosition.length === 2) {
          bestPositionStep = getBestPosition(diffWinnerAndPlayerPosition.length, bestPositionStep)
          if (!computerCellArray.includes(positionId)) {
            priority = [...priority, diffWinnerAndPlayerPosition]
          }
          bestWinnerPositions[positionId] = {
            id: positionId,
            weight: computerCellArray.includes(positionId) ? 0 : 1
          }
        }
        if (diffWinnerAndPlayerPosition.length === 1) {
          bestPositionStep = getBestPosition(diffWinnerAndPlayerPosition.length, bestPositionStep)

          bestWinnerPositions[positionId] = {
            id: positionId,
            weight: computerCellArray.includes(positionId) ? 0 : 2
          }
        }
      })
    })

    /** Если игрок не занял центр **/
    if (!playerCellArray.includes(5)) {
      bestWinnerPositions[5] = {
        id: 5,
        weight: 4
      }
    }

    /** Если игроку остался не один ход **/
    if (bestPositionStep > 1) {
      /** Наиболее часто повторяющиеся позиции, вероятнее всего игрок встанет сюда **/
      priority = _.flattenDeep(priority)
      let maxPriority = maxRepetitions(priority.sort())

      bestWinnerPositions[maxPriority] = {
        id: maxPriority,
        weight: 3
      }
    }

    /** Выйграшных позиций не осталось **/
    if (!_.flattenDeep(allWinnerPosition).length) {
      this.gameOver()

      /** Возвращаем ложь **/
      return false
    } else {

      /** Если есть последний программы для победы **/
      return finalyStepForCPU ?

        /** Добавляем его в объект **/
        {...bestWinnerPositions, [finalyStepForCPU.id]:finalyStepForCPU} :

        /** Оставляем как есть **/
        bestWinnerPositions
    }
  }
}

export default app