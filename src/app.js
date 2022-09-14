import React from "react";
import RuleList from './ruleList.js';
import uuid from '../utils/uuid';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      valueVisible: {},
      rules: this.props.rules
    };
    this.generateKey(this.props.rules);
    this.handleCondition = this.handleCondition.bind(this);
    this.handleAddRule = this.handleAddRule.bind(this);
    this.addRulesById = this.addRulesById.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.addGroupById = this.addGroupById.bind(this);
    this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
    this.deleteRulesById = this.deleteRulesById.bind(this);
    this.idChange = this.idChange.bind(this);
  }
  componentDidMount() {
  }
  generateKey (rules) {
    rules.forEach(item => {
      item.key = uuid()
      if (item.rules) this.generateKey(item.rules)
    })
  }
  updateRules () {
    this.setState({
      rules: this.state.rules
    })
  }
  findRulesById (rules, id, callback) {
    rules.forEach((item, index) => {
      if (item.id === id) {
        callback(item, rules, index)
      }
      if (item.rules) this.findRulesById(item.rules, id, callback)
    })
  }
  handleCondition (val) {
    this.changeCondition(this.state.rules, val)
    this.updateRules()
  }
  changeCondition (rules, id) {
    this.findRulesById(rules, id, (item) => {
      item.condition = item.condition === "AND" ? "OR" : "AND";
    })
  }
  handleAddRule (val) {
    this.addRulesById(this.state.rules, val)
    this.updateRules()
  }
  addRulesById (rules, id) {
    this.findRulesById(rules, id, (item) => {
      item.rules.push({
        id: this.props.fields[0].id,
        operator: this.props.operators[0].id,
        value: '',
        key: uuid()
      })
    })
  }
  handleAddGroup (val) {
    this.addGroupById(this.state.rules, val)
    this.updateRules()
  }
  addGroupById (rules, id) {
    this.findRulesById(rules, id, (item) => {
      item.rules.push({
        condition: 'OR',
        id: Number.parseInt(Math.random() * 100000),
        key: uuid(),
        rules: [{
          id: this.props.fields[0].id,
          key: uuid(),
          operator: this.props.operators[0].id,
          value: ''
        }]
      })
    })
  }
  handleDeleteGroup (val) {
    this.deleteRulesById(this.state.rules, val)
    this.updateRules()
  }
  deleteRulesById (rules, id) {
    this.findRulesById(rules, id, (item, itemRules, itemIndex) => {
      itemRules.splice(itemIndex, 1)
    })
  }
  idChange (id, val) {
    this.findRulesById(this.state.rules, id, (item) => {
      item.id = val;
    })
    this.updateRules()
  }
  render() {
    return <div className="wrap">
      <RuleList
        rules={this.state.rules}
        fields={this.props.fields}
        operators={this.props.operators}
        valueVisible={this.state.valueVisible}
        handleCondition={this.handleCondition}
        handleAddRule={this.handleAddRule}
        handleAddGroup={this.handleAddGroup}
        handleDeleteGroup={this.handleDeleteGroup}
        idChange={this.idChange}
      />
    </div>;
  }
}
export default App;