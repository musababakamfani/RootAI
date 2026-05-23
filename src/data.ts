import { Opportunity } from './types';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Web Developer Apprenticeship',
    type: 'job',
    category: 'jobs',
    provider: 'ALX Africa',
    location: 'Nairobi, Kenya',
    summary: '6-month program with job placement',
    detail: 'Learn full-stack development',
    isSaved: false
  },
  {
    id: '2',
    title: 'Cassava Farming Grant',
    type: 'grant',
    category: 'farming',
    provider: 'IFAD',
    location: 'Lagos, Nigeria',
    summary: '$5,000 for farmers',
    detail: 'Apply now',
    isSaved: true
  }
];
