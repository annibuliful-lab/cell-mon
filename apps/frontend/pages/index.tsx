import { Button, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useMobile } from '../hooks/useMobile';

export function Index() {
  const { isMobile } = useMobile();
  const form = useForm({
    initialValues: { username: '', password: '' },

    validate: {
      username: (value) =>
        value.length < 7 ? 'Name must have at least 8 letters' : null,
      password: (value) =>
        value.length === 0 ? 'Password must not empty' : null,
    },
  });

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
      <form onSubmit={form.onSubmit(console.log)} autoComplete="off">
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
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default Index;
