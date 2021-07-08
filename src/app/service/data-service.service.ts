import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITrailQuestionAnswers } from '../models/trailQuestionAnswers';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor() { }
  getDynamicData(): Observable<ITrailQuestionAnswers> {
    const data: ITrailQuestionAnswers = {
      questions: [
        {
          key: 'Firstname',
          label: 'What is the First Name',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'First Name',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['Lastname']
            }
          ],
          value: null
        },
        {
          key: 'Lastname',
          label: 'What is the Last Name',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'Last Name',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['DOB']
            }
          ],
          value: null
        },
        {
          key: 'DOB',
          label: 'What is your Date Of Birth?',
          required: true,
          controlType: 'textbox-date',
          options: null,
          placeholder: 'Date Of Birth',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['Gender']
            }
          ],
          value: null
        },
        {
          key: 'Gender',
          label: 'What is your Gender?',
          required: false,
          controlType: 'radio',
          options: [
            {
              key: 'Male',
              value: 'Male',
              resetOptions: false
            },
            {
              key: 'Female',
              value: 'Female',
              resetOptions: false
            },
            {
              key: 'NonBinary',
              value: 'Non-Binary',
              resetOptions: false
            }],
          placeholder: '',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['Experience']
            }
          ],
          value: null
        },
        {
          key: 'Experience',
          label: 'Rate your experience',
          required: false,
          controlType: 'star-rating',
          options: [{
            key: '',
            value: ''
          }],
          placeholder: 'Experience',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['AddressLine1', 'AddressLine2', 'City', 'State', 'Zipcode', 'Country']
            }
          ],
          value: null
        },
        {
          key: 'AddressLine1',
          label: 'What is your address?',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'Street',
          group: 'Address',
          nextSteps: null,
          value: null
        },
        {
          key: 'AddressLine2',
          label: 'Unit/Apt/Suite #',
          required: false,
          controlType: 'textbox',
          options: null,
          placeholder: 'Unit/Apt/Suite # (optional)',
          group: 'Address',
          nextSteps: null,
          value: null
        },
        {
          key: 'City',
          label: 'City',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'City',
          group: 'Address',
          nextSteps: null,
          value: null
        },
        {
          key: 'State',
          label: 'State',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'State',
          group: 'Address',
          nextSteps: null,
          value: null
        },
        {
          key: 'Zipcode',
          label: 'Zipcode',
          required: true,
          controlType: 'textbox-numeric',
          options: null,
          placeholder: 'Zip',
          group: 'Address',
          nextSteps: null,
          value: null
        },
        {
          key: 'Country',
          label: 'Country',
          required: true,
          controlType: 'textbox',
          options: null,
          placeholder: 'Country',
          group: 'Address',
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['Income']
            }
          ],
          value: null
        },
        {
          key: 'Income',
          label: 'What is your income?',
          required: true,
          controlType: 'textbox-usd',
          options: null,
          placeholder: 'Country',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['Satisfaction']
            }
          ],
          value: null
        },
        {
          key: 'Satisfaction',
          label: 'How satisfied are you with the product?',
          required: true,
          controlType: 'dropdown',
          options: [
            {
              key: 'NotSatisfied',
              value: 'Not Satisfied',
              resetOptions: false
            },
            {
              key: 'Satisfied',
              value: 'Satisfied',
              resetOptions: false
            },
            {
              key: 'HighlySatisfied',
              value: 'Highly Satisfied',
              resetOptions: false
            }
          ],
          placeholder: 'Satisfaction',
          group: null,
          nextSteps: null,
          value: null
        },
      ],
      answers: null
    };
    return of(data);
  }
}
