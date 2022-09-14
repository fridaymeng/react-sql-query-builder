import React from "react";
import { DatePicker, Button, Input, Row, Col, Select, Radio, Rate } from 'antd';
const { Option } = Select;
class RuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // console.log(this.props)
  }
  render() {
    return <React.Fragment>
        {this.props.rules.map(item => (
          <React.Fragment key={item.key}>
            { item['condition'] ? <div className="rules-wrap">
              <div className="rules-header">
                <Row>
                  <Col span={12}>
                    <Radio.Group onChange={() => this.props.handleCondition(item.id)} value={item['condition']} optionType="button" buttonStyle="solid">
                      <Radio value="AND">And</Radio>
                      <Radio value="OR">Or</Radio>
                    </Radio.Group>
                  </Col>
                  <Col span={12}>
                    <div className="ctl-wrap">
                      <Button type="primary" onClick={() => this.props.handleAddRule(item.id)}>Add Rule</Button>
                      <Button type="primary" onClick={() => this.props.handleAddGroup(item.id)}>Add Group</Button>
                      {
                        item.id !== 0 ? <Button type="danger" onClick={() => this.props.handleDeleteGroup(item.id)}>Delete</Button> : null
                      }
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="rules-body">
                <div key={item.key} className="rules-list">
                  {item.rules ? item.rules.map(ruleItem => (
                    <React.Fragment key={ruleItem.key}>
                      {
                        !ruleItem["condition"] ? <div className="rule-container">
                          <Row gutter={8}>
                            <Col>
                              <div className="id-wrap">
                                <Select onChange={(val) => this.props.idChange(ruleItem.id, val)} className="select" value={ruleItem.id}>
                                  {
                                    this.props.fields ? this.props.fields.map(fieldItem => (
                                      <Option key={fieldItem.id} value={fieldItem.id}>{ fieldItem.name }</Option>
                                    )) : null
                                  }
                                </Select>
                              </div>
                            </Col>
                            <Col>
                              <div className="operator-wrap">
                                <Select className="select" value={ruleItem.operator}>
                                  {
                                    this.props.operators ? this.props.operators.map(operatorItem => (
                                      <Option key={operatorItem.id} value={operatorItem.id}>{ operatorItem.name }</Option>
                                    )) : null
                                  }
                                </Select>
                              </div>
                            </Col>
                            <Col ><Input value={ruleItem.value} /></Col>
                          </Row>
                        </div> : null
                      }
                    </React.Fragment>
                  )) : null}
                  { item.rules ? <RuleList
                    rules={item.rules}
                    fields={this.props.fields}
                    operators={this.props.operators}
                    handleCondition={this.props.handleCondition}
                    handleAddRule={this.props.handleAddRule}
                    handleAddGroup={this.props.handleAddGroup}
                    handleDeleteGroup={this.props.handleDeleteGroup}
                    idChange={this.props.idChange}
                  /> : null }
                </div>
              </div>
            </div> : null}
          </React.Fragment>
        ))}
    </React.Fragment>;
  }
}
export default RuleList;