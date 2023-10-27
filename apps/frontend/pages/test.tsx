import { useUploadfileMutation } from '@cell-mon/graphql-codegen';

const TestPage = () => {
  const [uploadFile] = useUploadfileMutation();
  return (
    <input
      type="file"
      multiple
      required
      onChange={({ target: { files } }) => {
        if (files[0]) {
          uploadFile({
            variables: {
              file: files[0],
            },
          });
        }
      }}
    />
  );
};

export default TestPage;
