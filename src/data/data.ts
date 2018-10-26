export const Categories: any[] = [
    {
        _id: 'fnb',
        desc: 'food',
        icon: 'pizza'
    },
    {
        _id: 'hc',
        desc: 'health care',
        icon: 'medkit'
    },
    {
        _id: 'tra',
        desc: 'transportation',
        icon: 'bus'
    },
    {
        _id: 'pc',
        desc: 'personal care',
        icon: 'person'
    },
    {
        _id: 'edu',
        desc: 'education',
        icon: 'school'
    },
    {
        _id: 'ent',
        desc: 'entertainment',
        icon: 'game-controller-b'
    },
    {
        _id: 'lei',
        desc: 'leisure',
        icon: 'wine'
    },
    {
        _id: 'trv',
        desc: 'travel',
        icon: 'plane'
    },
    {
        _id: 'shp',
        desc: 'shopping',
        icon: 'pricetags'
    },
    {
        _id: 'bll',
        desc: 'bills',
        icon: 'calendar'
    },
    {
        _id: 'oth',
        desc: 'others',
        icon: 'clipboard'
    }
];

export const BGColor: any[] = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(205, 83, 96, 0.8)',
    'rgba(247, 206, 62, 0.8)',
    'rgba(255, 59, 63, 0.8)',
    'rgba(86, 86, 86, 0.8)',
    'rgba(118, 50, 63, 0.8)',
    'rgba(217, 133, 59, 0.8)',
    'rgba(34, 34, 34, 0.8)',
    'rgba(110, 115, 118, 0.8)',
    'rgba(0, 205, 50), 0.8)'
];
export const HoverColor: any[] = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4bc0c0",
    "#36A2EB",
    "#FFCE56",
    "#CD5360",
    "#f7CE3E",
    "#FF3B3F",
    "#565656",
    "#76323F",
    "#D9853B",
    "#222",
    "#6E7376",
    "#32CD32"
];

export const challenges = [
    {
      title: '31-Day Challenge',
      description: 'Some saving challenges take too long to finish so people have a hard time sticking to them. This challenge provides a short-term goal to encourage saving.',
      expectedAmount: 620,
      increment: 20,
      length: 31,

      count: 'Day',
      type: 'Static'
    },
    {
      title: '52-Week Challenge',
      description: 'This challenge involves saving an increasing amount each week until the end of the year. This version of the challenge starts at PHP 5 and has a weekly increment of PHP 5 each week.',
      expectedAmount: 6890,
      increment: 5,
      length: 52,

      count: 'Week',
      type: 'Incremental'
    }
  ];