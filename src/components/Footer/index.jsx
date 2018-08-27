import React from 'react'

import { Layout } from 'antd'

import './index.less'

const { Footer } = Layout;

export default class commonFooter extends React.Component {
  constructor () {
    super()
  }

  render () {

    return (
      <Footer style={{ textAlign: 'center' }}>
        JVL Gaming © 2018
      </Footer>
    )
  }
}
