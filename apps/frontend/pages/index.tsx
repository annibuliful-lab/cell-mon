import { useLoginMutation } from '@cell-mon/graphql-codegen';
import { Icon } from '@iconify/react';
import { Box, Button, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { setCookie } from 'cookies-next';
import { useAtom } from 'jotai';
import { minLength, object, string } from 'valibot';

import { useMobile } from '../hooks/useMobile';
import { authAtom } from '../store/auth';
import { errorAtom } from '../store/error';
import { valibotResolver } from '../utils/valibot-form-resolver';

const schema = object({
  username: string('Username is required', [
    minLength(8, 'Username must have at least 8 characters'),
  ]),
  password: string('Password is required', [
    minLength(8, 'Password must have at least 8 characters'),
  ]),
});

export function Index() {
  const [, setAuth] = useAtom(authAtom);
  const [, setError] = useAtom(errorAtom);

  const { isMobile } = useMobile();
  const [login, { loading }] = useLoginMutation();

  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: valibotResolver(schema),
  });

  const handleLogin = async (data: { username: string; password: string }) => {
    setAuth({
      token: null,
      refreshToken: null,
      loading: true,
    });

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
      loading: false,
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
      <Box
        style={{
          margin: 'auto',
          width: '85%',
        }}
      >
        <Icon
          icon="carbon:cell-tower"
          width="48"
          style={{
            display: 'inline',
          }}
        />

        <Title
          order={3}
          style={{
            textAlign: 'center',
            paddingLeft: '8px',
          }}
          display="inline"
        >
          Cellular Network Surveillance
        </Title>
      </Box>

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
