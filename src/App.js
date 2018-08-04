import React from 'react'
import { observer, inject } from 'mobx-react'
import { action, observable } from 'mobx'

const Cell = observer(({ html, onClick }) => (
  <span onClick={onClick}>{html}</span>
))

const App = ({ app: { cells, handleClick } }) => (
  <div className='App'
       style={{
         display: 'flex',
         flexWrap: 'wrap',
         width: 108
       }}>
    {Object.values(cells).map(({id, cellBody}) => (
        <Cell
          key={id}
          onClick={() => handleClick(id)}
          html={cellBody}/>
      ))}
  </div>
)

export default inject('app')(observer(App))
