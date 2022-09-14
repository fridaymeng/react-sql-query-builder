// npm run build
// npm publish
import React, { Component } from "react";
import ReactDOM from "react-dom";
import 'antd/dist/antd.less';
import './index.less';

import App from './app.js'
class QueryBuilder {
  init (params) {
    ReactDOM.render(<App {...params} />, document.getElementById(params.id));
  }
}
export {
  QueryBuilder
}
