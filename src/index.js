import React, { Component } from 'react'
import { uuid } from '../utils/uuid'
import EventEmitter from '../utils/events'
import './index.scss'
import { Select, Button, Switch, Input } from 'antd'

const Option = Select.Option

const operatorExpression = [
  { name: 'equal', id: 1, symbol: '=' },
  { name: 'not equal', id: 2, symbol: '!=' },
  { name: 'is not null', id: 3, symbol: 'is not null' },
  { name: 'is null', id: 4, symbol: 'is null' },
  { name: 'in', id: 5, symbol: 'in' },
  { name: 'not in', id: 6, symbol: 'not in' },
  { name: 'less', id: 7, symbol: 'less' },
  { name: 'less or equal', id: 8, symbol: 'less or equal' },
  { name: 'greater', id: 9, symbol: 'greater' },
  { name: 'greater or equal', id: 10, symbol: 'greater or equal' }
]

const allFields = [{ name: 'ID', id: uuid(8, 16) }, { name: 'User', id: uuid(8, 16) }, { name: 'Age', id: uuid(8, 16) }, { name: 'Nation', id: uuid(8, 16) }, { name: 'Datepicker', id: uuid(8, 16) }, { name: 'SelectList', id: uuid(8, 16) }]

class GenerateGroupExpression extends React.Component {
  constructor(props) {
    super(props)
    this.onChange = this.onChange.bind(this)
  }
  onChange(checked) {
    EventEmitter.trigger('recordData', {
      type: 'gate',
      data: checked ? 'and' : 'or',
      groupIndex: this.props.index,
      parentIndex: this.props.parentIndex,
      order: this.props.order
    })
  }
  render() {
    return (
      <div className="selectGroupLi" data-id={this.props.id} data-index={this.props.index} data-order={this.props.order} data-parent-index={this.props.parentIndex}>
        <div
          style={{
            padding: '0px 0 5px 0px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Button
            type="danger"
            icon="close"
            data-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            className={this.props.index === 0 ? 'hide' : ''}
            onClick={this.props.delGroupExpression}
            style={{
              margin: '0 0 0 5px',
              float: 'right'
            }}
          >
            Delete Group
          </Button>
          <Button
            icon="plus"
            data-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.addGroupExpression}
            className={this.props.index !== 'false ' ? '' : 'hide'} //默认只显示一个添加按钮
            style={{
              margin: '0 0 0 6px',
              float: 'right'
            }}
          >
            Add Group
          </Button>
          <Switch checkedChildren="AND" unCheckedChildren="OR" defaultChecked={this.props.gate === 'and' ? true : false} onChange={this.onChange} />
        </div>
        {this.props.data.map((item, index) => {
          return (
            <GenerateSingleExpression
              groupIndex={this.props.index}
              parentIndex={this.props.parentIndex}
              groupLth={this.props.groupLth}
              order={this.props.order}
              index={index}
              data={item}
              total={this.props.data.length}
              key={Math.random()}
              delOneExpression={this.props.delOneExpression}
              addOneExpression={this.props.addOneExpression}
              allFields={this.props.allFields}
            />
          )
        })}
        {this.props.childrens}
      </div>
    )
  }
}

class GenerateSingleExpression extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allFields: this.props.allFields,
      leftFields: this.props.allFields,
      rightFields: this.props.data.rightFields || [],
      operatorId: this.props.data.operatorId,
      refresh: true
    }
    this.selectExpression = this.selectExpression.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
  componentWillMount() {
    if (this.props.data.operatorId === 3 || this.props.data.operatorId === 4) {
      this.setState({
        rightClassName: 'hide'
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.refresh) {
      return false
    } else {
      return true
    }
  }
  selectExpression(data) {
    let className = ''
    if (data.symbol === 'is not null' || data.symbol === 'is null') {
      className = 'hide'
    }
    this.setState({
      rightClassName: className,
      operatorId: data.id
    })
  }
  handleInputChange(e) {
    const target = e.target
    const data = target.dataset
    EventEmitter.trigger('recordData', {
      type: 'right',
      value: target.value,
      order: data.order,
      index: data.index,
      groupIndex: this.props.groupIndex,
      parentIndex: this.props.parentIndex
    })
  }
  render() {
    return (
      <div className="selectListLi">
        <SelectList
          key={Math.random()}
          data={this.props.data}
          groupIndex={this.props.groupIndex}
          parentIndex={this.props.parentIndex}
          order={this.props.order}
          index={this.props.index}
          type="left"
          allFields={this.state.leftFields}
          search="true"
          className={this.props.data.leftClassName ? this.props.data.leftClassName : ''}
        />
        <OperatorSelectList
          key={Math.random()}
          operatorId={this.state.operatorId}
          data={this.props.data}
          index={this.props.index}
          groupIndex={this.props.groupIndex}
          parentIndex={this.props.parentIndex}
          order={this.props.order}
          selectExpression={this.selectExpression}
          className={this.props.data.operatorClassName ? this.props.data.operatorClassName : ''}
        />
        <Input placeholder="value" data-order={this.props.order} data-index={this.props.index} onChange={this.handleInputChange} type="right" defaultValue={this.props.data.rightValue} className={this.state.rightClassName ? this.state.rightClassName : ''} style={{ width: 150 }} />
        <div>
          <Button
            icon="close-circle"
            data-group-index={this.props.groupIndex}
            data-expression-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.delOneExpression}
            type="danger"
            className={this.props.total === 1 && this.props.groupLth === 0 ? 'hide' : ''}
            style={{
              margin: '0 0 0 6px'
            }}
          >
            Delete
          </Button>
        </div>
        <div>
          <Button
            icon="plus-circle"
            data-group-index={this.props.groupIndex}
            data-expression-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.addOneExpression}
            type="primary"
            className={this.props.total > 1 && this.props.index < this.props.total - 1 ? 'hide' : ''} //默认只显示一个添加按钮
            style={{
              margin: '0 0 0 6px'
            }}
          >
            Add
          </Button>
        </div>
      </div>
    )
  }
}

class SelectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      optionsArr: this.props.allFields,
      className: 'class-' + uuid(10, 16) + ' ' + this.props.className
    }
  }
  componentWillMount() {
    this.props.allFields.forEach(item => {
      if (item.id === this.props.data.leftId) {
        this.setState({
          defaultValue: item.name
        })
      }
    })
  }
  handleChange = index => {
    EventEmitter.trigger('recordData', {
      type: this.props.type,
      data: this.state.optionsArr[index],
      index: this.props.index,
      order: this.props.order,
      groupIndex: this.props.groupIndex,
      parentIndex: this.props.parentIndex
    })
  }
  render() {
    return (
      <div>
        <Select
          className={this.state.className}
          defaultValue={this.state.defaultValue}
          showSearch={this.props.search === 'true' ? true : false}
          style={{ width: 200 }}
          onChange={this.handleChange}
          getPopupContainer={() => document.getElementById('tree-id')}
          autoClearSearchValue={false}
          placeholder="please select..."
          filterOption={(input, option) => {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }}
        >
          {this.state.optionsArr &&
            this.state.optionsArr.map((item, index) => (
              <Option key={Math.random()} value={index}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
    )
  }
}
class OperatorSelectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expressions: operatorExpression
    }
  }
  componentWillMount() {
    operatorExpression.forEach(item => {
      if (item.id === this.props.operatorId) {
        this.setState({
          defaultValue: item.name
        })
      }
    })
  }
  handleChange = index => {
    const expression = this.state.expressions[index]
    this.props.selectExpression(expression)
    EventEmitter.trigger('recordData', {
      type: 'operator',
      data: expression,
      index: this.props.index,
      order: this.props.order,
      groupIndex: this.props.groupIndex,
      parentIndex: this.props.parentIndex
    })
  }
  render() {
    return (
      <div>
        <Select
          className={this.props.data.operationClassName ? this.props.data.operationClassName : ''}
          defaultValue={this.state.defaultValue}
          style={{ width: 100, margin: '0 6px 0 6px' }}
          placeholder="please select"
          optionFilterProp="children"
          onChange={this.handleChange}
          getPopupContainer={() => document.getElementById('tree-id')}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {this.state.expressions.map((item, index) => (
            <Option key={Math.random()} value={index}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      group: [
        {
          gate: 'and',
          expressionList: [{}],
          group: [],
          id: 0
        }
      ],
      allFields: allFields,
      refresh: true,
      nums: 0
    }
    this.count = 0
    this.addOneExpression = this.addOneExpression.bind(this)
    this.delOneExpression = this.delOneExpression.bind(this)
    this.addGroupExpression = this.addGroupExpression.bind(this)
    this.delGroupExpression = this.delGroupExpression.bind(this)
    this.findGroup = this.findGroup.bind(this)
  }
  componentDidMount() {
    const $this = this
    /* 注册recordData */
    EventEmitter.off('recordData')
    EventEmitter.on('recordData', function(params) {
      $this.findGroup({
        group: $this.state.group,
        index: params.groupIndex,
        type: 'expression',
        callback: function(item) {
          let $obj = $this.findExpression(item.expressionList, params.index)
          switch (params.type) {
            case 'gate':
              item.gate = params.data
              break
            case 'operator':
              $obj.operatorId = params.data.id
              delete $obj.rightValue
              delete $obj.rightClassName
              break
            case 'left':
              $obj.leftId = params.data.id
              break
            case 'right':
              $obj.rightValue = params.value
              break
            default:
          }
          $this.setState(
            {
              group: $this.state.group,
              refresh: false
            },
            function() {
              $this.props.onChange && $this.props.onChange($this.state.group)
            }
          )
          $this.child.undateString()
        }
      })
    })
  }
  componentDidUpdate() {
    this.props.onChange && this.props.onChange(this.state.group)
  }
  componentWillUnmount() {
    this.setState = () => {
      return
    }
  }
  onRef = ref => {
    this.child = ref
  }
  findGroup = params => {
    params.group &&
      params.group.forEach((item, index) => {
        if (item.id === params.index) {
          switch (params.type) {
            case 'expression':
              /* 表达式change */
              params.callback && params.callback(item)
              break
            case 'addExpression':
              /* 添加表达式 */
              item.expressionList.push({})
              break
            case 'deleteExpression':
              /* 删除表达式 */
              item.expressionList.splice(params.expressionIndex, 1)
              break
            case 'delete':
              /* 删除分组 */
              params.group.splice(index, 1)
              break
            default:
              item.group.push({
                gate: 'and',
                expressionList: [{}],
                group: [],
                id: ++this.count,
                parentId: item.id
              })
              break
          }
        } else {
          this.findGroup({
            group: item.group,
            index: params.index,
            parentIndex: params.parentIndex,
            order: params.order,
            type: params.type,
            callback: params.callback,
            expressionIndex: params.expressionIndex
          })
        }
      })
  }
  findExpression(list, id) {
    return list[id]
  }
  renderGroup(params) {
    let $dom = []
    let $domChild = []
    params.data &&
      params.data.forEach((item, index) => {
        if (item.group && item.group.length > 0) {
          $domChild.push(this.renderGroup({ data: item.group, index: index + 1 }))
        }
        $dom.push(
          <GenerateGroupExpression
            key={Math.random()}
            onChange={this.props.onChange}
            index={item.id}
            parentIndex={item.parentId !== undefined ? item.parentId : 'false'}
            order={index}
            id={uuid(10, 16)}
            total={params.data.length}
            gate={item.gate}
            data={item.expressionList}
            groupLth={item.group ? item.group.length : 0}
            allFields={this.state.allFields}
            delOneExpression={this.delOneExpression}
            addOneExpression={this.addOneExpression}
            delGroupExpression={this.delGroupExpression}
            addGroupExpression={this.addGroupExpression}
            childrens={$domChild}
          />
        )
        $domChild = []
      })
    return $dom
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.refresh) {
      return false
    } else {
      return true
    }
  }
  /*** 添加单个表达式 ***/
  addOneExpression(obj) {
    const $target = obj.target.dataset
    const $index = $target.groupIndex
    const $parentIndex = $target.parentIndex
    const $order = $target.order
    if ($parentIndex === 'false') {
      this.state.group[$index].expressionList.push({})
    } else {
      this.findGroup({
        group: this.state.group,
        index: Number($index),
        parentIndex: Number($parentIndex),
        order: Number($order),
        type: 'addExpression'
      })
    }
    this.setState({
      group: this.state.group,
      refresh: true
    })
  }
  /*** 删除单个表达式 ***/
  delOneExpression(obj) {
    const $data = obj.target.dataset
    const $index = Number.parseInt($data.groupIndex, 10)
    const $parentIndex = $data.parentIndex
    const $order = $data.order
    const $expressionIndex = $data.expressionIndex
    if ($parentIndex === 'false') {
      this.state.group[$index].expressionList.splice($expressionIndex, 1)
    } else {
      this.findGroup({
        group: this.state.group,
        index: Number($index),
        parentIndex: Number($parentIndex),
        expressionIndex: $expressionIndex,
        order: Number($order),
        type: 'deleteExpression'
      })
    }
    this.setState({
      expressionList: this.state.group,
      refresh: true
    })
  }
  findId(group, params) {
    group.map((item, index) => {
      if (params.parentIndex === 'false') {
        item.group.push({
          gate: 'and',
          expressionList: [{}],
          group: [],
          id: ++this.count,
          parentId: 0
        })
      } else {
        if (Number(params.index) === item.id && Number(params.parentIndex) === item.parentId) {
          item.group.push({
            gate: 'and',
            expressionList: [{}],
            group: [],
            id: ++this.count,
            parentId: item.parentId + 1
          })
        } else {
          this.findId(item.group, params)
        }
      }
      return item
    })
  }
  /*** 添加单个表达式分组 ***/
  addGroupExpression(e) {
    const $data = e.target.dataset
    const $this = this
    if ($data.parentIndex === 'false') {
      this.state.group[0].group.push({
        gate: 'and',
        expressionList: [{}],
        group: [],
        id: ++this.count,
        parentId: 0
      })
    } else {
      $this.findGroup({
        group: $this.state.group,
        index: Number($data.index),
        parentIndex: Number($data.parentIndex),
        order: Number($data.order)
      })
    }
    this.forceUpdate()
  }
  /*** 删除单个表达式分组 ***/
  delGroupExpression(e) {
    const $data = e.target.dataset
    this.findGroup({
      group: this.state.group,
      index: Number($data.index),
      parentIndex: Number($data.parentIndex),
      order: Number($data.order),
      type: 'delete'
    })
    this.setState({
      group: this.state.group,
      refresh: true
    })
  }
  render() {
    return (
      <div className="tree-wrap" id="tree-id">
        <div className="selectGroupWrap">
          {this.renderGroup({ data: this.state.group })}
          <StringFormat key={Math.random()} onRef={this.onRef} group={this.state.group} />
        </div>
      </div>
    )
  }
}

class StringFormat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      html: ''
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }
  undateString = () => {
    this.forceUpdate()
  }
  render() {
    return <pre className="language-bash">{JSON.stringify(this.props.group, null, 2)}</pre>
  }
}

export default App

//how to use
//import a from "react-sql-query-builder";
