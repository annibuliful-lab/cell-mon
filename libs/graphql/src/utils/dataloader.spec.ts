import { mapDataloaderRecord, mapDataloaderRecords } from './dataloader';

describe('dataloader', () => {
  it('returns map data structure with custom field', () => {
    expect(
      mapDataloaderRecord({
        data: [
          { id: '1', name: 'AAAA' },
          { id: '2', name: 'BBBB' },
          { id: 'a', name: 'CCCC' },
        ],
        ids: ['1', '2'],
        idField: 'id',
      }),
    ).toMatchSnapshot();
  });

  it('returns map muliple data structure with custom field', () => {
    expect(
      mapDataloaderRecords({
        data: [
          {
            id: '2860e6ff-87ef-44c8-995f-7c4b516c1794',
            projectId: 'TEST_PROJECT_ID_1',
            tag: 'TAG_A',
          },
          {
            id: '6f5b77dd-7859-4229-86d8-1b92063b24e1',
            projectId: 'TEST_PROJECT_ID_2',
            tag: 'TAG_B',
          },
          {
            id: '2860e6ff-87ef-44c8-995f-7c4b516c1890',
            projectId: 'TEST_PROJECT_ID_1',
            tag: 'TAG_C',
          },
        ],
        ids: ['TEST_PROJECT_ID_1', 'TEST_PROJECT_ID_2'],
        idField: 'projectId',
      }),
    ).toMatchSnapshot();
  });

  it('returns map multiple data structure with sort order', () => {
    expect(
      mapDataloaderRecords({
        data: [
          {
            id: 'tag-1',
            projectId: 'TEST_PROJECT_ID_1',
            tag: 'TAG_A',
          },
          {
            id: 'tag-2',
            projectId: 'TEST_PROJECT_ID_2',
            tag: 'TAG_E',
          },
          {
            id: 'tag-3',
            projectId: 'TEST_PROJECT_ID_1',
            tag: 'TAG_C',
          },
          {
            id: 'tag-4',
            projectId: 'TEST_PROJECT_ID_2',
            tag: 'TAG_B',
          },
          {
            id: 'tag-5',
            projectId: 'TEST_PROJECT_ID_2',
            tag: 'TAG_D',
          },
        ],
        ids: ['TEST_PROJECT_ID_1', 'TEST_PROJECT_ID_2'],
        idField: 'projectId',
        keySortOrder: {
          TEST_PROJECT_ID_1: {
            id: 'TEST_PROJECT_ID_1',
            keyIds: ['tag-3', 'tag-1'],
          },
          TEST_PROJECT_ID_2: {
            id: 'TEST_PROJECT_ID_1',
            keyIds: ['tag-4', 'tag-5', 'tag-2'],
          },
        },
      }),
    ).toMatchSnapshot();
  });
});
