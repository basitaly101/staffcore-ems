'use client';

import { useEffect, useState } from 'react';

export default function VideoLoader({ onFinish }) {
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (ended) {
      onFinish();
    }
  }, [ended, onFinish]);

  return (
    <div style={styles.container}>
      <video
        src="/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={() => setEnded(true)}
        style={styles.video}
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    background: 'black',
    zIndex: 9999,
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};
