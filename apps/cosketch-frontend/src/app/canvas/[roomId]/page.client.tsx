'use client';

// import Canvas from '@/components/canvas/canvas';
import CanvasV2 from '@/components/canvas/canvas.v2';
import ProtectCanvasRoute from '@/higher-order-component/protectCanvasRoute';
import { useParams } from 'next/navigation';

const CanvasClient = () => {
  const { roomId } = useParams() as { roomId: string };

  return (
    <ProtectCanvasRoute roomId={roomId}>
      <section className='h-[100vh] overflow-hidden'>
        {/* <Canvas roomId={roomId} /> */}
        <CanvasV2 roomId={roomId} />
      </section>
    </ProtectCanvasRoute>
  );
};

export default CanvasClient;
