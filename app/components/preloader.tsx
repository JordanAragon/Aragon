
'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const word = 'ARAGON';

export default function Preloader() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.body.classList.add('is-preloading');
    const startDelay = window.setTimeout(() => {
      document.documentElement.dataset.aragonEntry = 'ready';
      window.dispatchEvent(new Event('aragon:entry-start'));
      setLeaving(true);
    }, reduced ? 120 : 680);

    return () => {
      window.clearTimeout(startDelay);
      document.body.classList.remove('is-preloading');
    };
  }, [reduced]);

  if (!visible) return null;

  return (
    <motion.div
      className="v9-preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduced ? 0.12 : 0.42, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => {
        if (!leaving) return;
        document.body.classList.remove('is-preloading');
        setVisible(false);
      }}
      aria-hidden="true"
    >
      <div className="v9-preloader-inner">
        <div className="v9-preloader-meta">
          <span>ARAGON / 2026</span>
          <span>INDEX 001</span>
        </div>
        <div className="v9-preloader-main">
          <motion.div
            className="v9-preloader-mark"
            initial={{ opacity: 0, scale: .8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduced ? .12 : .35, ease: [0.16, 1, .3, 1] }}
          >
            A
          </motion.div>
          <div className="v9-preloader-word">
            {word.split('').map((letter, index) => (
              <motion.span
                key={letter + index}
                initial={{ y: '115%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  delay: reduced ? 0 : .05 + index * .035,
                  duration: reduced ? .1 : .38,
                  ease: [0.16, 1, .3, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="v9-preloader-line"><i /></div>
        <div className="v9-preloader-foot">
          <span>SOFTWARE · DIGITAL · TECHNOLOGY</span>
          <span>BUILT WITH INTENT</span>
        </div>
      </div>
    </motion.div>
  );
}
