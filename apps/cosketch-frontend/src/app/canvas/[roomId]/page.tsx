import Canvas from './page.client';
import getPageMetadata from '@/lib/getPageMetadata';

export const metadata = getPageMetadata({
  title: 'Canvas - Real-Time Collaboration',
  description:
    'Jump into a live CoSketch canvas! Collaborate, sketch, and share ideas with your team instantly.',
});

const CanvasPage = () => {
  return (
    <section className='bg-black'>
      <Canvas />;
    </section>
  );
};

export default CanvasPage;
