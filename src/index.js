// npm run build
// npm publish

import React, { Component } from "react";
import { uuid } from "../utils/uuid";
import EventEmitter from "../utils/events";
import "antd/dist/antd.css";
import "./index.scss";
import moment from 'moment';
import { Select, Button, Switch, Input, DatePicker } from "antd";
import { CloseCircleOutlined, PlusOutlined, PlusCircleOutlined } from '@ant-design/icons';

const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;

let operatorExpression = [];

const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';

class GenerateGroupExpression extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }
  onChange(checked) {
    EventEmitter.trigger("recordData", {
      type: "gate",
      data: checked ? "and" : "or",
      groupIndex: this.props.index,
      parentIndex: this.props.parentIndex,
      order: this.props.order
    });
  }
  render() {
    return (
      <div
        className="selectGroupLi"
        data-id={this.props.id}
        data-index={this.props.index}
        data-order={this.props.order}
        data-parent-index={this.props.parentIndex}
      >
        <div
          style={{
            padding: "0px 0 5px 0px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <Button
            type="danger"
            icon={<CloseCircleOutlined />}
            data-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            className={this.props.index === 0 ? "hide" : ""}
            onClick={this.props.delGroupExpression}
            style={{
              margin: "0 0 0 5px",
              float: "right"
            }}
          >
            Delete Group
          </Button>
          <Button
            icon={<PlusOutlined />}
            data-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.addGroupExpression}
            className={this.props.index !== "false " ? "" : "hide"} //默认只显示一个添加按钮
            style={{
              margin: "0 0 0 6px",
              float: "right"
            }}
          >
            Add Group
          </Button>
          <Switch
            checkedChildren="AND"
            unCheckedChildren="OR"
            defaultChecked={this.props.gate === "and" ? true : false}
            onChange={this.onChange}
          />
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
          );
        })}
        {this.props.childrens}
      </div>
    );
  }
}

class GenerateSingleExpression extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rightValueType: this.props.data.rightValType,
      allFields: this.props.allFields,
      leftFields: this.props.allFields,
      rightFields: this.props.data.rightFields || [],
      operatorId: this.props.data.operatorId,
      refresh: true,
      rightClassName: this.props.data.rightClassName,
      leftId: ""
    };
    this.selectExpression = this.selectExpression.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.selectFields = this.selectFields.bind(this);
  }
  componentDidMount() {
    let $rightDefaultValue = this.props.data.rightValue;
    this.setState({
      operatorClassName: this.props.data.operatorClassName,
      rightDefaultValue: $rightDefaultValue
    });
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.refresh) {
      return false;
    } else {
      return true;
    }
  }
  selectExpression(data) {
    let className = "";
    if (data.rightFields === false) {
      className = "hide";
    }
    this.setState({
      rightClassName: className,
      operatorId: data.id,
      rightValueType: this.state.rightValType || this.props.data.rightValType,
      rightDefaultValue: null
    });
  }
  selectFields(data) {
    const params = {
      data: data,
      type: "left",
      rightClassName: "hide",
      rightValueType: undefined,
      rightValType: "Input",
      leftId: data.id,
      operatorId: undefined,
      index: this.props.index,
      groupIndex: this.props.groupIndex
    };
    if (data.type !== undefined) {
      params.rightValType = data.type;
      params.rightDefaultValue = null;
    }
    this.setState(params);
    EventEmitter.trigger("recordData", params);
  }
  handleInputChange(params) {
    params.type = "right";
    this.setState({
      rightDefaultValue: params.value
    });
    EventEmitter.trigger("recordData", params);
  }
  handleRightFiledsChange = val => {
    EventEmitter.trigger("recordData", {
      type: "right",
      rightFiledsId: val,
      index: this.props.index,
      groupIndex: this.props.groupIndex
    });
  };
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
          selectFields={this.selectFields}
          type="left"
          allFields={this.state.leftFields}
          search="true"
        />
        <OperatorSelectList
          key={Math.random()}
          operatorId={this.state.operatorId}
          data={this.props.data}
          index={this.props.index}
          groupIndex={this.props.groupIndex}
          parentIndex={this.props.parentIndex}
          order={this.props.order}
          rightValType={this.state.rightValType}
          selectExpression={this.selectExpression}
          className={this.state.operatorClassName}
        />
        {/* Input */}
        {this.state.rightValueType === "Input" ? (
          <Input
            placeholder="value"
            data-order={this.props.order}
            data-index={this.props.index}
            value={this.state.rightDefaultValue}
            onChange={e =>
              this.handleInputChange({
                order: this.props.order,
                index: this.props.index,
                groupIndex: this.props.groupIndex,
                parentIndex: this.props.parentIndex,
                value: e.currentTarget.value
              })
            }
            type="right"
            className={
              this.state.rightClassName ? this.state.rightClassName : ""
            }
            style={{ width: 180, verticalAlign: "bottom" }}
          />
        ) : (
          ""
        )}
        {/* SelectList */}
        {this.state.rightValueType === "SelectList" ? (
          <div>
            <Select
              onChange={this.handleRightFiledsChange}
              placeholder="please select..."
              style={{ width: 200 }}
            >
              {this.props.data.rightFields.map((item, index) => (
                <Option key={index} value={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </div>
        ) : (
          ""
        )}
        {/* DatePicker */}
        {this.state.rightValueType === "DatePicker" ? (
          <div>
            <DatePicker
              onChange={(date, dateString) =>
                this.handleInputChange({
                  order: this.props.order,
                  index: this.props.index,
                  groupIndex: this.props.groupIndex,
                  parentIndex: this.props.parentIndex,
                  value: dateString
                })
              }
              value={this.state.rightDefaultValue ? moment(this.state.rightDefaultValue, dateFormat) : undefined}
              className={
                this.state.rightClassName ? this.state.rightClassName : ""
              }
            />
          </div>
        ) : (
          ""
        )}
        {/* MonthPicker */}
        {this.state.rightValueType === "MonthPicker" ? (
          <div>
            <MonthPicker
              onChange={(date, dateString) =>
                this.handleInputChange({
                  order: this.props.order,
                  index: this.props.index,
                  groupIndex: this.props.groupIndex,
                  parentIndex: this.props.parentIndex,
                  value: dateString
                })
              }
              value={this.state.rightDefaultValue ? moment(this.state.rightDefaultValue, monthFormat) : undefined}
              className={
                this.state.rightClassName ? this.state.rightClassName : ""
              }
            />
          </div>
        ) : (
          ""
        )}
        {/* RangePicker */}
        {this.state.rightValueType === "RangePicker" ? (
          <div>
            <RangePicker
              onChange={(date, dateString) =>
                this.handleInputChange({
                  order: this.props.order,
                  index: this.props.index,
                  groupIndex: this.props.groupIndex,
                  parentIndex: this.props.parentIndex,
                  value: dateString
                })
              }
              value={(this.state.rightDefaultValue && this.state.rightDefaultValue.length === 2) ? [moment(this.state.rightDefaultValue[0], dateFormat), moment(this.state.rightDefaultValue[1], dateFormat)] : undefined}
              className={
                this.state.rightClassName ? this.state.rightClassName : ""
              }
            />
          </div>
        ) : (
          ""
        )}
        <div>
          <Button
            icon={<CloseCircleOutlined />}
            data-group-index={this.props.groupIndex}
            data-expression-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.delOneExpression}
            type="danger"
            className={
              this.props.total === 1 && this.props.groupLth === 0 ? "hide" : ""
            }
            style={{
              margin: "0 0 0 6px"
            }}
          >
            Delete
          </Button>
        </div>
        <div>
          <Button
            icon={<PlusCircleOutlined />}
            data-group-index={this.props.groupIndex}
            data-expression-index={this.props.index}
            data-parent-index={this.props.parentIndex}
            data-order={this.props.order}
            onClick={this.props.addOneExpression}
            type="primary"
            className={
              this.props.total > 1 && this.props.index < this.props.total - 1
                ? "hide"
                : ""
            } //默认只显示一个添加按钮
            style={{
              margin: "0 0 0 6px"
            }}
          >
            Add
          </Button>
        </div>
      </div>
    );
  }
}

class SelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      defaultValue: undefined,
      optionsArr: this.props.allFields,
      className: "class-" + uuid(10, 16) + " " + this.props.className
    };
  }
  componentDidMount() {
    this.props.allFields.forEach(item => {
      if (item.id === this.props.data.leftId) {
        this.setState({
          value: item.name
        });
      }
    });
  }
  handleChange = index => {
    const item = this.state.optionsArr[index];
    this.props.selectFields(item);
  };
  render() {
    return (
      <div>
        <Select
          className={this.state.className}
          defaultValue={this.state.defaultValue}
          value={this.state.value}
          showSearch={this.props.search === "true" ? true : false}
          style={{ width: 200 }}
          onChange={this.handleChange}
          getPopupContainer={() => document.getElementById("tree-id")}
          autoClearSearchValue={false}
          placeholder="please select..."
          filterOption={(input, option) => {
            return (
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
        >
          {this.state.optionsArr &&
            this.state.optionsArr.map((item, index) => (
              <Option key={index} value={index}>
                {item.name}
              </Option>
            ))}
        </Select>
      </div>
    );
  }
}
class OperatorSelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expressions: operatorExpression,
      defaultValue: this.props.operatorDefaultValue
    };
  }
  componentDidMount() {
    operatorExpression.forEach(item => {
      if (typeof item.id === "undefined") {
        item.id = uuid(8, 16);
      }
      if (item.id === this.props.operatorId) {
        this.setState({
          defaultValue: item.name
        });
      }
    });
  }
  handleChange = index => {
    const expression = this.state.expressions[index];
    this.props.selectExpression(expression);
    EventEmitter.trigger("recordData", {
      type: "operator",
      data: expression,
      index: this.props.index,
      order: this.props.order,
      groupIndex: this.props.groupIndex,
      rightValType: this.props.rightValType,
      parentIndex: this.props.parentIndex
    });
  };
  render() {
    return (
      <div>
        <Select
          className={this.props.className}
          value={this.state.defaultValue}
          style={{ width: 200, margin: "0 6px 0 6px" }}
          placeholder="please select"
          optionFilterProp="children"
          onChange={this.handleChange}
          getPopupContainer={() => document.getElementById("tree-id")}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.state.expressions.map((item, index) => (
            <Option key={Math.random()} value={index}>
              {item.name}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
}

const operators = {}
const leftNames = {}

function generateExpression (data = [], sql) {
  data.forEach((expression, expressionIndex) => {
    if (expression.leftId) {
      if (expressionIndex === 0) {
        sql += leftNames[expression.leftId]
      } else {
        sql += " and " + leftNames[expression.leftId]
      }
    }
    if (expression.operatorId) {
      sql += " " + operators[expression.operatorId] + " "
    }
    if (expression.rightValue) sql += `"${expression.rightValue}"`
  })
  return sql + " ";
}

function generateGroup (data = []) {
  let sql = ""
  data.forEach(item => {
    if (item.expressionList) sql += generateExpression(item.expressionList, sql)
    if (item.group) sql += generateGroup (item.group, "")
  })
  return sql
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operators: {},
      leftNames: {},
      group: [
        {
          gate: "and",
          expressionList: [{}],
          group: [],
          id: 0
        }
      ],
      allFields: this.props.fields || [],
      console: this.props.console || false,
      refresh: true
    };
    this.count = 0;
    this.addOneExpression = this.addOneExpression.bind(this);
    this.delOneExpression = this.delOneExpression.bind(this);
    this.addGroupExpression = this.addGroupExpression.bind(this);
    this.delGroupExpression = this.delGroupExpression.bind(this);
    this.findGroup = this.findGroup.bind(this);
    this.formatSQL = this.formatSQL.bind(this)
  }
  componentDidMount() {
    const $this = this;
    operatorExpression = $this.props.operators || [];
    operatorExpression.forEach(item => {
      operators[item.id] = item.symbol
    })
    this.props.fields.forEach(item => {
      leftNames[item.id] = item.name
    })
    /* 注册recordData */
    EventEmitter.off("recordData");
    EventEmitter.on("recordData", function(params) {
      $this.findGroup({
        group: $this.state.group,
        index: params.groupIndex,
        type: "expression",
        callback: function(item) {
          let $obj = $this.findExpression(item.expressionList, params.index);
          switch (params.type) {
            case "gate":
              item.gate = params.data;
              break;
            case "operator":
              $obj.operatorId = params.data.id;
              if (params.data.rightFields === false) {
                $obj.rightClassName = "hide";
              } else {
                $obj.rightClassName = "";
              }
              delete $obj.rightValue;
              break;
            case "left":
              $obj.leftId = params.data.id;
              $obj.rightValType = params.rightValType;
              $obj.operatorClassName = "";
              if (params.data.rightFields) {
                $obj.rightFields = params.data.rightFields;
              }
              delete $obj.rightValue;
              delete $obj.operatorId;
              break;
            case "right":
              if (params.rightFiledsId) {
                $obj.rightFiledsId = params.rightFiledsId;
              } else if (params.value) {
                $obj.rightValue = params.value;
              }
              break;
            default:
          }
          $this.setState(
            {
              group: $this.state.group,
              refresh: false
            },
            function() {
              $this.props.onChange && $this.props.onChange($this.state.group, this.formatSQL($this.state.group));
            }
          );
          if ($this.child) {
            $this.child.undateString();
          }
        }
      });
    });
  }
  componentDidUpdate() {
    this.props.onChange && this.props.onChange(this.state.group, this.formatSQL(this.state.group));
  }
  formatSQL (data) {
    let sql = ""
    data.forEach((item) => {
      sql += generateExpression(item.expressionList, sql)
      if (item.group && item.group.length > 0) {
        sql += generateGroup(item.group, "")
      }
    })
    return sql
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  onRef = ref => {
    this.child = ref;
  }
  findGroup = params => {
    params.group &&
      params.group.forEach((item, index) => {
        if (item.id === params.index) {
          switch (params.type) {
            case "expression":
              /* 表达式change */
              params.callback && params.callback(item);
              break;
            case "addExpression":
              /* 添加表达式 */
              item.expressionList.push({});
              break;
            case "deleteExpression":
              /* 删除表达式 */
              item.expressionList.splice(params.expressionIndex, 1);
              break;
            case "delete":
              /* 删除分组 */
              params.group.splice(index, 1);
              break;
            default:
              item.group.push({
                gate: "and",
                expressionList: [{}],
                group: [],
                id: ++this.count,
                parentId: item.id
              });
              break;
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
          });
        }
      });
  }
  findExpression(list, id) {
    return list[id];
  }
  renderGroup(params) {
    let $dom = [];
    let $domChild = [];
    params.data &&
      params.data.forEach((item, index) => {
        if (item.group && item.group.length > 0) {
          $domChild.push(
            this.renderGroup({ data: item.group, index: index + 1 })
          );
        }
        $dom.push(
          <GenerateGroupExpression
            key={Math.random()}
            onChange={this.props.onChange}
            index={item.id}
            parentIndex={item.parentId !== undefined ? item.parentId : "false"}
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
        );
        $domChild = [];
      });
    return $dom;
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.refresh) {
      return false;
    } else {
      return true;
    }
  }
  /*** 添加单个表达式 ***/
  addOneExpression(obj) {
    const $target = obj.currentTarget.dataset;
    const $index = $target.groupIndex;
    const $parentIndex = $target.parentIndex;
    const $order = $target.order;
    if ($parentIndex === "false") {
      this.state.group[$index].expressionList.push({});
    } else {
      this.findGroup({
        group: this.state.group,
        index: Number($index),
        parentIndex: Number($parentIndex),
        order: Number($order),
        type: "addExpression"
      });
    }
    this.setState({
      group: this.state.group,
      refresh: true
    });
  }
  /*** 删除单个表达式 ***/
  delOneExpression(obj) {
    const $data = obj.currentTarget.dataset;
    const $index = Number.parseInt($data.groupIndex, 10);
    const $parentIndex = $data.parentIndex;
    const $order = $data.order;
    const $expressionIndex = $data.expressionIndex;
    if ($parentIndex === "false") {
      this.state.group[$index].expressionList.splice($expressionIndex, 1);
    } else {
      this.findGroup({
        group: this.state.group,
        index: Number($index),
        parentIndex: Number($parentIndex),
        expressionIndex: $expressionIndex,
        order: Number($order),
        type: "deleteExpression"
      });
    }
    this.setState({
      expressionList: this.state.group,
      refresh: true
    });
  }
  findId(group, params) {
    group.map((item, index) => {
      if (params.parentIndex === "false") {
        item.group.push({
          gate: "and",
          expressionList: [{}],
          group: [],
          id: ++this.count,
          parentId: 0
        });
      } else {
        if (
          Number(params.index) === item.id &&
          Number(params.parentIndex) === item.parentId
        ) {
          item.group.push({
            gate: "and",
            expressionList: [{}],
            group: [],
            id: ++this.count,
            parentId: item.parentId + 1
          });
        } else {
          this.findId(item.group, params);
        }
      }
      return item;
    });
  }
  /*** 添加单个表达式分组 ***/
  addGroupExpression(e) {
    const $data = e.currentTarget.dataset;
    const $this = this;
    if ($data.parentIndex === "false") {
      this.state.group[0].group.push({
        gate: "and",
        expressionList: [{}],
        group: [],
        id: ++this.count,
        parentId: 0
      });
    } else {
      $this.findGroup({
        group: $this.state.group,
        index: Number($data.index),
        parentIndex: Number($data.parentIndex),
        order: Number($data.order)
      });
    }
    this.forceUpdate();
  }
  /*** 删除单个表达式分组 ***/
  delGroupExpression(e) {
    const $data = e.currentTarget.dataset;
    this.findGroup({
      group: this.state.group,
      index: Number($data.index),
      parentIndex: Number($data.parentIndex),
      order: Number($data.order),
      type: "delete"
    });
    this.setState({
      group: this.state.group,
      refresh: true
    });
  }
  render() {
    return (
      <div className="tree-wrap" id="tree-id">
        <div className="selectGroupWrap">
          {this.renderGroup({ data: this.state.group })}
          {this.state.console === true ? (
            <StringFormat
              key={Math.random()}
              onRef={this.onRef}
              group={this.state.group}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

class StringFormat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      html: ""
    };
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  undateString = () => {
    this.forceUpdate();
  };
  render() {
    return (
      <pre className="language-bash">
        {JSON.stringify(this.props.group, null, 2)}
      </pre>
    );
  }
}

export default App;
