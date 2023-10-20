import { useLoginMutation } from '@cell-mon/graphql-codegen';
import { Button, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { setCookie } from 'cookies-next';
import { useAtom } from 'jotai';

import { useMobile } from '../hooks/useMobile';
import { authAtom } from '../store/auth';
import { errorAtom } from '../store/error';

export function Index() {
  const [, setAuth] = useAtom(authAtom);
  const [, setError] = useAtom(errorAtom);

  const { isMobile } = useMobile();
  const [login, { loading }] = useLoginMutation();

  const form = useForm({
    initialValues: { username: '', password: '' },

    validate: {
      username: (value) =>
        value.length < 7 ? 'Name must have at least 8 letters' : null,
      password: (value) =>
        value.length === 0 ? 'Password must not empty' : null,
    },
  });

  const handleLogin = async (data: { username: string; password: string }) => {
    const { data: loginResponse, errors } = await login({
      variables: {
        input: {
          username: data.username,
          password: data.password,
        },
      },
    });

    if (errors?.length) {
      setError(
        errors.map((error) => ({
          code: error.name,
          message: error.message,
        })),
      );

      return;
    }

    setCookie('token', loginResponse.login.token);
    setCookie('refreshToken', loginResponse.login.refreshToken);

    setAuth({
      token: loginResponse.login.token,
      refreshToken: loginResponse.login.refreshToken,
    });

    form.reset();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: isMobile ? '70vw' : '30vw',
      }}
    >
      <Title
        order={3}
        style={{
          textAlign: 'center',
        }}
      >
        Cellular Monitoring
      </Title>
      <form onSubmit={form.onSubmit(handleLogin)} autoComplete="off">
        <TextInput
          autoComplete="off"
          label="username"
          {...form.getInputProps('username')}
          my="sm"
          width="10"
        />
        <TextInput
          label="password"
          type="password"
          autoComplete="off"
          {...form.getInputProps('password')}
          my="sm"
        />
        <Button
          variant="filled"
          style={{ display: 'block', margin: 'auto' }}
          type="submit"
          loading={loading}
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Index;
