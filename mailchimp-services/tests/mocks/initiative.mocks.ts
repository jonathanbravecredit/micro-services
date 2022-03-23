export const BUY_HOUSE_MOCK = {
  id: {
    S: 'abc',
  },
  program: {
    S: '1',
  },
  initiativeStatus: {
    S: 'not_started',
  },
  initiativeReason: {
    S: 'buy_house',
  },
  createdOn: {
    S: '2022-03-13T17:24:05.567Z',
  },
  modifiedOn: {
    S: '2022-03-13T17:24:05.567Z',
  },
  initiative: {
    S: 'future_score',
  },
  initiativeTitle: {
    S: 'Your plan to buy a house',
  },
  initiativeTasks: {
    L: [
      {
        M: {
          parentId: {
            S: 'future_score',
          },
          taskId: {
            S: 'buy_house',
          },
          taskStatus: {
            S: 'not_started',
          },
          subTasks: {
            L: [
              {
                M: {
                  parentId: {
                    S: 'buy_house',
                  },
                  taskId: {
                    S: 'review_report',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '0',
                  },
                },
              },
              {
                M: {
                  parentId: {
                    S: 'buy_house',
                  },
                  taskId: {
                    S: 'open_self_loan',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '1',
                  },
                },
              },
              {
                M: {
                  parentId: {
                    S: 'buy_house',
                  },
                  taskId: {
                    S: 'build_savings',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '2',
                  },
                },
              },
              {
                M: {
                  parentId: {
                    S: 'buy_house',
                  },
                  taskId: {
                    S: 'manage_debts',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '3',
                  },
                },
              },
            ],
          },
          taskOrder: {
            N: '1',
          },
        },
      },
    ],
  },
};

export const CC_MOCK = {
  id: {
    S: 'xyz',
  },
  program: {
    S: '1',
  },
  initiativeStatus: {
    S: 'not_started',
  },
  initiativeReason: {
    S: 'credit_card',
  },
  createdOn: {
    S: '2022-03-14T01:22:00.492Z',
  },
  modifiedOn: {
    S: '2022-03-14T01:22:00.492Z',
  },
  initiative: {
    S: 'future_score',
  },
  initiativeTitle: {
    S: 'Your plan to get a credit card',
  },
  initiativeTasks: {
    L: [
      {
        M: {
          parentId: {
            S: 'future_score',
          },
          taskId: {
            S: 'credit_card',
          },
          taskStatus: {
            S: 'not_started',
          },
          subTasks: {
            L: [
              {
                M: {
                  parentId: {
                    S: 'credit_card',
                  },
                  taskId: {
                    S: 'review_report',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '0',
                  },
                },
              },
              {
                M: {
                  parentId: {
                    S: 'credit_card',
                  },
                  taskId: {
                    S: 'open_self_loan',
                  },
                  taskStatus: {
                    S: 'not_started',
                  },
                  taskOrder: {
                    N: '1',
                  },
                },
              },
            ],
          },
          taskOrder: {
            N: '0',
          },
        },
      },
    ],
  },
};
