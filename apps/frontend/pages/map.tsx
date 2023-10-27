import dynamic from 'next/dynamic';

const GoogleMap = dynamic(() => import('../components/GoogleMap'), {
  ssr: false,
});

const Map = () => {
  return <GoogleMap />;
};

export default Map;
