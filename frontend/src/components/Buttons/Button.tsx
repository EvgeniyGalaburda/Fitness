import React, { type MouseEventHandler } from 'react'
import style from './Button.module.css'

const Button: React.FC<{children: React.ReactNode, onClick: MouseEventHandler<HTMLButtonElement> | undefined}> = ({children, onClick}) => {
  return (
    <button onClick={onClick} className={style.button}>{children}</button>
  )
}

export default Button