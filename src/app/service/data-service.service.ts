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
          placeholder: 'Income',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['recommendtoothers']
            }
          ],
          value: null
        },
        {
          key: 'recommendtoothers',
          label: 'Would you recommend this to others?',
          required: true,
          controlType: 'dropdown',
          options: [
            {
              key: 'yes',
              value: 'Yes',
              resetOptions: false
            },
            {
              key: 'no',
              value: 'No',
              resetOptions: false
            },
            {
              key: 'maybe',
              value: 'May be',
              resetOptions: false
            }
          ],
          placeholder: 'Recommendation',
          group: null,
          nextSteps: [{
            value: '',
            nextQuestionId: ['howdidyouhear']
          }],
          value: null
        },
        {
          key: 'howdidyouhear',
          label: 'How did you hear about us?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'socialmedia',
              value: 'Social Media',
              resetOptions: false
            },
            {
              key: 'television',
              value: 'Television',
              resetOptions: false
            },
            {
              key: 'searchengine',
              value: 'Search Engine',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: [
            {
              value: 'socialmedia',
              nextQuestionId: ['socialmedia']
            },
            {
              value: 'television',
              nextQuestionId: ['television']
            },
            {
              value: 'newspaper',
              nextQuestionId: ['newspaper']
            },
            {
              value: 'searchengine',
              nextQuestionId: ['searchengine']
            }
          ],
          value: null
        },
        {
          key: 'socialmedia',
          label: 'Which Social Media?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'fb',
              value: 'Facebook',
              resetOptions: false
            },
            {
              key: 'twitter',
              value: 'Twitter',
              resetOptions: false
            },
            {
              key: 'linkedin',
              value: 'LinkedIn',
              resetOptions: false
            },
            {
              key: 'instagram',
              value: 'Instagram',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: [
            {
              value: '',
              nextQuestionId: ['device']
            }
          ],
          value: null
        },
        {
          key: 'device',
          label: 'Which device do you use?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'mobile',
              value: 'Mobile',
              resetOptions: false
            },
            {
              key: 'ipad',
              value: 'Ipad',
              resetOptions: false
            },
            {
              key: 'laptop',
              value: 'Laptop',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: null,
          value: null
        },
        {
          key: 'television',
          label: 'Which television medium',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'localchannel',
              value: 'Local',
              resetOptions: false
            },
            {
              key: 'nationaltelevison',
              value: 'National Televison',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: [
            {
              value: 'localchannel',
              nextQuestionId: ['localchannel']
            },
            {
              value: 'nationaltelevison',
              nextQuestionId: ['nationaltelevison']
            }
          ],
          value: null
        },
        {
          key: 'localchannel',
          label: 'Which Local Channel?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'abclocal',
              value: 'ABC Local Channel',
              resetOptions: false
            },
            {
              key: 'statelocalchannel',
              value: 'State Local Channel',
              resetOptions: false
            },
            {
              key: 'applenews',
              value: 'Apple News',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: null,
          value: null
        },
        {
          key: 'nationaltelevison',
          label: 'Which National Television?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'foxnews',
              value: 'Fox News',
              resetOptions: false
            },
            {
              key: 'cnbc',
              value: 'CNBC',
              resetOptions: false
            },
            {
              key: 'bbc',
              value: 'BBC',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: null,
          value: null
        },
        {
          key: 'searchengine',
          label: 'Which Search engine?',
          required: true,
          controlType: 'radio',
          options: [
            {
              key: 'google',
              value: 'Google',
              resetOptions: false
            },
            {
              key: 'yahoo',
              value: 'Yahoo',
              resetOptions: false
            },
            {
              key: 'bing',
              value: 'Bing',
              resetOptions: false
            }
          ],
          placeholder: '',
          group: null,
          nextSteps: null,
          value: null
        }

      ],
      answers: null
    };
    return of(data);
  }
}
