import { Blob, fetch, File, FormData } from 'cross-undici-fetch';
import { nanoid } from 'nanoid';

describe('File service', () => {
  it.skip('upload file', async () => {
    const blob = new Blob(['hello'], { type: 'text/plain' });
    const filename = `TEST_FILE_${nanoid()}.txt`;
    const file = new File([blob], filename, { type: '' });
    const formData = new FormData();
    const map = `{"0":["variables.picture"]}`;
    const operations = `{"query":"mutation UploadFile($picture: Upload!){  uploadFile(picture: $picture)}"}`;
    formData.append('operations', operations);
    formData.append('map', map);
    formData.append('0', file);
    console.log({ file });

    const response = await fetch('http://127.0.0.1:3000/graphql', {
      method: 'POST',
      body: formData,
    });

    console.log(await response.json());
  });
});
