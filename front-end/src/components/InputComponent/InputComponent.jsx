import React from 'react'
import { Input } from 'antd'

const InputComponent = ({size,placeholder,bordered,style,...rests }) => { //mục đích tạo ra inputcomponent là để sử dụng nhiều nơi 
  return (
    <Input 
        size={size} 
        placeholder={placeholder} 
        bordered={bordered} 
        style={style} 
        {...rests}
        />
  )
}

export default InputComponent
