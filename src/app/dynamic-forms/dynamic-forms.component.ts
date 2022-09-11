import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { QuestionAnswers } from './questionAnswers';
import { INode } from './node';
import { ControlMap } from './control-map';
import { ControlNode } from './control-node';
import { MatButton } from '@angular/material/button';
import { IAnswer } from '../models/answers';
import { IQuestion } from '../models/questions';
import { ITrailQuestionAnswers } from '../models/trailQuestionAnswers';
import { IChangeEvent, ControlActionType } from '../models/changeEvent';
import { CustomValidator } from '../custom-validator';
import { DataServiceService } from '../service/data-service.service'
import { UidGenerator } from './uidGenerator';

@Component({
  selector: 'app-dynamic-forms',
  templateUrl: './dynamic-forms.component.html',
  styleUrls: ['./dynamic-forms.component.scss']
})
export class DynamicFormsComponent implements OnInit {

  private trailAnswers: IAnswer[];
  private trailQuestions?: ITrailQuestionAnswers;
  private trailQATriggerSubscription?: Subscription;
  private questionAnswers?: QuestionAnswers;
  private uidGenerator?: UidGenerator;

  formSubscription?: Subscription;
  maxDate = new Date();
  isDisabled = false;
  resetOptions: Map<string, string> = new Map();
  questionFormArray: UntypedFormGroup;
  formArrayMap: Map<string, ControlMap> = new Map();

  constructor(
    private formbuilder: UntypedFormBuilder,
    private dataSvc: DataServiceService
  ) {
    this.trailAnswers = null
  }

  ngOnDestroy(): void {
    if (
      this.trailQATriggerSubscription === null ||
      this.trailQATriggerSubscription === undefined
    ) {
      return;
    }
    this.trailQATriggerSubscription.unsubscribe();
  }

  ngOnInit() {
    this.trailQATriggerSubscription = this.dataSvc.getDynamicData().subscribe(
      (data) => {
        if (data == null) {
          return;
        }
        this.initialize();
        this.trailQuestions = data;
        this.trailAnswers = data.answers;
        this.questionAnswers = new QuestionAnswers(this.trailQuestions.questions);
        this.uidGenerator = new UidGenerator();
        this.onFormInit();
      }
    );
  }

  getGraph(key: string) {
    if (this.formArrayMap == null || this.formArrayMap.size === 0) {
      return null;
    }
    if (this.formArrayMap.get(key) == null) {
      return null;
    }
    return this.formArrayMap.get(key);
  }

  private verifyTrailEndRules(lastNode: INode) {
    const lastQuestion = lastNode.questions[lastNode.questions.length - 1];
    if (lastQuestion.nextSteps == null || lastQuestion.nextSteps.length === 0) {
      return true;
    }
    const rule1 = lastQuestion.nextSteps.some(step => step.value === '' && step.nextQuestionId.length > 0);
    if (rule1) {
      return false;
    }
    const lastFormValue = lastNode.formControls.get(lastQuestion.key).value;
    let rule2: boolean;
    if (lastFormValue instanceof Array) {
      for (const eachVal of lastFormValue) {
        rule2 = lastQuestion.nextSteps.some(step => step.value === eachVal && step.nextQuestionId.length > 0);
        if (rule2) {
          return false;
        }
      }
    }
    rule2 = lastQuestion.nextSteps.some(step => step.value === lastFormValue && step.nextQuestionId.length > 0);
    if (rule2) {
      return false;
    }
    return true;
  }

  initialize(): void {
    this.formArrayMap = new Map();
    this.uidGenerator = new UidGenerator();
    this.questionFormArray = null;
    this.isDisabled = false;
  }

  onFormInit(): void {
    let trailQA: IQuestion[] = this.trailQuestions.questions;
    if (this.isNullOrEmpty(trailQA)) {
      return;
    }

    if (!this.isNullOrEmpty(this.trailAnswers)) {
      this.createAnsweredTrail();
      return;
    }
    const node = this.toFormGroup(trailQA);
    const controlGraph = this.createControlGraph();
    controlGraph.addNode(node);
    this.questionFormArray = this.initQuestionGroup();
  }

  getNode(mapId: string, nodeId: string): INode {
    if (this.formArrayMap == null) {
      return null;
    }
    const graph = this.formArrayMap.get(mapId);
    if (graph == null) {
      return null;
    }
    return graph.get(nodeId);
  }

  initQuestionGroup() {
    const formGroups: any[] = [];
    this.formArrayMap.forEach((value: ControlMap, key: string) => {
      formGroups[key] = value.subFormGroup;
    });
    return this.formbuilder.group(formGroups);
  }

  initQuestionsFormArray(trailQuestionForm: UntypedFormGroup) {
    return this.formbuilder.group({
      questionsFormArray: this.formbuilder.array([trailQuestionForm]),
    });
  }

  initQuestionsGroupFormArray(trailQuestionGroup: UntypedFormGroup[]) {
    return this.formbuilder.group({
      questionsFormArray: this.formbuilder.array([...trailQuestionGroup]),
    });
  }

  onDropdownSelection(mapId: string, event: any, sourceNode: INode): void {
    const value = event.value;
    this.addOrReplaceOnChange(value, mapId, sourceNode);
  }
  onChipSelectionChange(event: IChangeEvent, mapId: string, sourceNode: INode): void {
    const value = event.recentValue;
    this.addOrReplaceOnChange(value, mapId, sourceNode);
  }
  onRadioButtonClick(mapId: string, event: any, sourceNode: INode) {
    const value = event.value;
    this.addOrReplaceOnChange(value, mapId, sourceNode);
  }
  private addOrReplaceOnChange(newValue: string, mapId: string, sourceNode: INode): void {
    const graph = this.getGraph(mapId);
    const newTrailNode = this.getNextTrail(sourceNode, newValue);
    if (!this.isNullOrEmpty(newTrailNode)) {
      if (!sourceNode.hasChildren) {
        graph.addToNode(sourceNode, newValue, newTrailNode);
        return;
      }
    }
    const allChildNodes = sourceNode.getChildren();
    allChildNodes.forEach(childNode => graph.remove(childNode));
    graph.addToNode(sourceNode, newValue, newTrailNode);
  }

  onCheckboxChange(event: IChangeEvent, mapId: string, sourceNode: INode) {
    const recentValue = event.recentValue;
    const action = event.action;
    const graph = this.getGraph(mapId);
    const specialCommand = event.specialCommand;
    switch (action) {
      case ControlActionType.Checked:
        if (specialCommand.toLowerCase() === 'reset') {
          if (sourceNode.hasChildren) {
            const allChildren = sourceNode.getChildren();
            allChildren.forEach(child => {
              graph.remove(child);
            });
          }
        }
        const newNode = this.getNextTrail(sourceNode, recentValue);
        if (newNode == null) {
          return;
        }
        graph.addToNode(sourceNode, recentValue, newNode);
        break;
      case ControlActionType.UnChecked:
        const nodes = sourceNode.getChildForRelation(recentValue);
        if (nodes == null || nodes.length === 0) {
          return;
        }
        nodes.forEach(node => {
          graph.remove(node);
        });
        break;
    }
  }

  private getNextTrail(sourceNode: INode, value: string): INode {
    let currentQuestion: IQuestion;
    if (sourceNode.isGroup) {
      currentQuestion = sourceNode.questions[sourceNode.questions.length - 1];
    } else {
      currentQuestion = sourceNode.questions[0];
    }
    const nextQuesions = this.questionAnswers.getNextQuestions([value], currentQuestion);
    if (this.isNullOrEmpty(nextQuesions)) {
      return null;
    }
    const newNode = this.toFormGroup(nextQuesions);
    return newNode;
  }
  isNextButtonDisabled(node: INode): boolean {
    if (!node.formControls.valid) {
      return true;
    }
    if (node.hasChildren) {
      return true;
    }
    return false;
  }

  private shouldShowNextButton(questions: IQuestion[]): boolean {
    if (this.isDisabled) {
      return false;
    }
    const textBoxQuestions = questions.filter((qa) =>
      qa.controlType.startsWith('textbox') || qa.controlType.startsWith('star-rating')
    );
    if (this.isNullOrEmpty(textBoxQuestions)) {
      return false;
    }
    for (const eachQA of textBoxQuestions) {
      if (!this.isNullOrEmpty(eachQA.nextSteps)) {
        if (eachQA.nextSteps.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  handleNextButtonClick(
    mapId: string,
    sourceNode: INode,
    buttonRef: MatButton
  ): void {
    const graph = this.formArrayMap.get(mapId);
    const newNode = this.getNextTrail(sourceNode, '');
    graph.addToNode(sourceNode, 'click', newNode);
    buttonRef.disabled = true;
  }

  createAnsweredTrail(): void {
    const nextQuestions = this.trailQuestions[0];

    for (const trailGroupAnswer of this.trailAnswers) {
      const newControlGraph = this.createControlGraph();
      let questionsQueue: IQuestion[] = [...nextQuestions];
      let nodeQuestions: IQuestion[] = [];
      while (questionsQueue.length > 0) {
        const question = questionsQueue.shift();
        if (question.group == null) {
          nodeQuestions.push(question);
        } else {
          // For form group with grouped controls
          nodeQuestions.push(question);
          const allQuestionsForGroup = questionsQueue.filter(
            (q) => q.group === question.group
          );
          nodeQuestions.push(...allQuestionsForGroup);
          questionsQueue = questionsQueue.filter((q) => q.group !== question.group);
        }
        this.prepareAnsweredTrail(null, '', newControlGraph, nodeQuestions, trailGroupAnswer);
        nodeQuestions = [];
      }
    }
  }

  prepareAnsweredTrail(parentNode: INode, relationship: string, graph: ControlMap, questions: IQuestion[], answer: IAnswer): void {
    for (const eachQuestion of questions) {
      const qAnswer = answer.key === eachQuestion.key ? answer : null;
      if (qAnswer == null) {
        eachQuestion.value = [];
        continue;
      }
      eachQuestion.value = qAnswer.value;
    }
    const newNode = this.toFormGroup(questions);
    if (parentNode != null) {
      graph.addToNode(parentNode, relationship, newNode);
    } else {
      graph.addNode(newNode);
    }
    this.prepareNextTrails(newNode, graph, answer);
  }

  private prepareNextTrails(node: INode, graph: ControlMap, allAnswers: IAnswer): void {
    let trailSource: IQuestion;
    if (node.isGroup) {
      const lastItemIndex = node.questions.length - 1;
      trailSource = node.questions[lastItemIndex];
    } else {
      trailSource = node.questions[0];
    }
    if (trailSource.value != null && trailSource.value.length > 1) {
      // This control has multiple values, may be a checkbox
      for (const answer of trailSource.value) {
        const nextTrail = this.questionAnswers.getNextQuestions([answer], trailSource);
        if (nextTrail == null || nextTrail.length === 0) {
          continue;
        }
        this.prepareAnsweredTrail(node, answer, graph, nextTrail, allAnswers);
      }
    } else {
      const nextTrail = this.questionAnswers.getNextQuestions(trailSource.value, trailSource);
      if (nextTrail == null || nextTrail.length === 0) {
        return;
      }
      this.prepareAnsweredTrail(node, trailSource.value[0], graph, nextTrail, allAnswers);
    }

  }

  toFormGroup(questionsGroup: IQuestion[]): INode {
    let controls: UntypedFormGroup = null;
    let label = '';
    let newNode: INode;
    let allQuestionsForGroup: IQuestion[] = [];

    if (questionsGroup.length >= 0) {
      label = questionsGroup[0].label;
    }
    /* Always expecting the first on group leader,
    if group leader does not have a group name that mean they need have separate label,
    otherwise all controls in a group will be represented under one name.
    */
    let questionsQueue = [...questionsGroup];

    if (questionsQueue.length > 0) {
      const question = questionsQueue.shift();
      if (question.group == null) {
        /* create form group with one control */
        const controlFg: any = {};
        allQuestionsForGroup.push(question);
        const control = this.createFormControl(question);
        controlFg[question.key] = control;
        controls = new UntypedFormGroup(controlFg);
      } else {
        // For form group with grouped controls
        allQuestionsForGroup = questionsGroup.filter(
          (q) => q.group === question.group
        );
        controls = this.createGroupControls(allQuestionsForGroup);
        questionsQueue = questionsQueue.filter(
          (q) => q.group !== question.group
        );
      }
      newNode = new ControlNode(question.key, controls, label, null);
      newNode.questions = allQuestionsForGroup;
      newNode.showNextButton = this.shouldShowNextButton(questionsGroup);
    }

    return newNode;
  }

  createGroupControls(questions: IQuestion[]): UntypedFormGroup {
    if (questions == null || questions.length === 0) {
      return null;
    }
    const controls: any = {};
    for (const question of questions) {
      const control = this.createFormControl(question);
      controls[question.key] = control;
    }
    return new UntypedFormGroup(controls);
  }

  createFormControl(question: IQuestion) {
    let answer: any = '';
    let validatorList: ValidatorFn[] = [];
    validatorList = this.createControlValidators(question);
    if (!this.isNullOrEmpty(question.value)) {
      switch (question.controlType) {
        case 'textbox-date':
          answer = new Date(question.value[0]);
          break;
        case 'checkbox':
          answer = question.value;
          break;
        default:
          answer = question.value[0];
          break;
      }
    }
    return new UntypedFormControl({ value: answer, disabled: this.isDisabled }, validatorList);
  }

  private createControlValidators(question: IQuestion): ValidatorFn[] {
    const validatorList: ValidatorFn[] = [];
    if (question.required) {
      validatorList.push(Validators.required);
      if (question.controlType === 'textbox') {
        validatorList.push(CustomValidator.invalidEntry);
      }
    }
    switch (question.controlType) {
      case 'textbox-usd':
        validatorList.push(CustomValidator.usdCurrency);
        break;
      case 'textbox-numeric':
        validatorList.push(CustomValidator.numeric);
        break;
    }
    return validatorList;
  }

  isNullOrEmpty(value: any): boolean {
    if (Array.isArray(value)) {
      if (value == null || value.length === 0) {
        return true;
      }
      return false;
    }
    if (value == null || value === '') {
      return true;
    }
    return false;
  }

  removeFormGroup(mapId: string): void {
    this.questionFormArray.removeControl(mapId);
    this.formArrayMap.delete(mapId);
  }

  private onAdd = (subGroup: UntypedFormGroup, node: INode, mapId: string) => {
    const graph = this.formArrayMap.get(mapId);
    if (subGroup === null) {
      const control: any = {};
      control[node.key] = node.formControls; // this is one or more form control
      subGroup = new UntypedFormGroup(control); // this is a sub group, a container for set of controls
      graph.subFormGroup = subGroup;
    } else {
      subGroup.addControl(node.key, node.formControls);
    }
    if (this.questionFormArray == null) {
      const fg: any = {};
      fg[mapId] = subGroup;
      this.questionFormArray = this.formbuilder.group(fg);
      return;
    }
    if (this.questionFormArray.get(mapId) == null) {
      this.questionFormArray.addControl(mapId, subGroup);
    }
  }

  private onRemove = (subGroup: UntypedFormGroup, node: INode, mapId: string) => {
    const graph = this.formArrayMap.get(mapId);
    if (!graph.hasNodes) {
      this.formArrayMap.delete(mapId);
      this.questionFormArray.removeControl(mapId);
    }
    subGroup.removeControl(node.key);
  }

  private createControlGraph(): ControlMap {
    const controlGraph = new ControlMap(this.uidGenerator.generate());
    controlGraph.registerOnAdd(this.onAdd);
    controlGraph.registerOnRemove(this.onRemove);
    this.formArrayMap.set(controlGraph.mapUId, controlGraph);
    return controlGraph;
  }

}
