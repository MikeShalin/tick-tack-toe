export const emptyCell = '|___|'

export const cross = '|_X_|'

export const zero = '|_0_|'

export const initialArea =
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


export const winnerPosition = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], /** 3 клетки по горизонтали **/
  [1, 4, 7], [2, 5, 8], [3, 6, 9], /** 3 клетки по вертикали **/
  [1, 5, 9], [3, 5, 7]             /** 3 клетки по диагонали **/
]

export const winnerName = {
  [cross]: 'Player',
  [zero]: 'Computer'
}
